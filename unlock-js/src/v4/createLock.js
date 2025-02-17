import ethersUtils from '../utils'
import {
  GAS_AMOUNTS,
  ETHERS_MAX_UINT,
  UNLIMITED_KEYS_COUNT,
  ZERO,
} from '../constants'
import TransactionTypes from '../transactionTypes'

import { getErc20Decimals } from '../erc20'

/**
 * Returns the key price in its currency, rather than its decimal representation (Ether vs. Wei for example)
 * @param {*} currencyContractAddress
 * @param {*} lock
 * @param {*} provider
 */
async function _getKeyPrice(lock, provider) {
  const currencyContractAddress = lock.currencyContractAddress || ZERO

  if (currencyContractAddress !== ZERO) {
    // We need to get the decimal value
    const erc20Decimals = await getErc20Decimals(
      currencyContractAddress,
      provider
    )
    return ethersUtils.toDecimal(lock.keyPrice, erc20Decimals)
  }
  return ethersUtils.toWei(lock.keyPrice, 'ether')
}

/**
 * Creates a lock on behalf of the user, using version v4
 * @param {PropTypes.lock} lock
 * @param {function} callback invoked with the transaction hash
 */
export default async function (lock, callback) {
  const unlockContract = await this.getUnlockContract()
  let { maxNumberOfKeys } = lock
  if (maxNumberOfKeys === UNLIMITED_KEYS_COUNT) {
    maxNumberOfKeys = ETHERS_MAX_UINT
  }

  const decimalKeyPrice = _getKeyPrice(lock, this.provider)

  const currencyContractAddress = lock.currencyContractAddress || ZERO

  const lockName = lock.name || 'New Lock'
  const transactionPromise = unlockContract.functions[
    'createLock(uint256,address,uint256,uint256,string)'
  ](
    lock.expirationDuration,
    currencyContractAddress,
    decimalKeyPrice,
    maxNumberOfKeys,
    lockName,
    {
      gasLimit: GAS_AMOUNTS.createLock,
    }
  )
  const hash = await this._handleMethodCall(
    transactionPromise,
    TransactionTypes.LOCK_CREATION
  )

  if (callback) {
    callback(null, hash, await transactionPromise)
  }
  // Let's now wait for the lock to be deployed before we return its address
  const receipt = await this.provider.waitForTransaction(hash)
  const parser = unlockContract.interface
  const newLockEvent = receipt.logs
    .map((log) => {
      return parser.parseLog(log)
    })
    .filter((event) => event.name === 'NewLock')[0]

  if (newLockEvent) {
    return newLockEvent.values.newLockAddress
  }
  // There was no NewEvent log (transaction failed?)
  return null
}
