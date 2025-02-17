import styled from 'styled-components'
import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { ActionButton } from './ActionButton'
import { rpcForWalletConnect, selectProvider } from '../LoginPrompt'
import { ConfigContext } from '../../../utils/withConfig'

const AuthenticateButton = ({
  web3Provider,
  showAccount,
  onProvider,
  login,
}) => {
  const config = useContext(ConfigContext)

  const authenticateWithProvider = () => {
    onProvider(web3Provider)
  }

  const authenticateWithWalletConnect = () => {
    const walletConnectProvider = new WalletConnectProvider({
      rpc: rpcForWalletConnect(config),
    })
    onProvider(walletConnectProvider)
  }

  return (
    <>
      <p>First, select your authentication method:</p>
      <Container>
        <Button disabled={!web3Provider} onClick={authenticateWithProvider}>
          Crypto Wallet
        </Button>
        <QrButton onClick={authenticateWithWalletConnect}>
          <svg
            fill="white"
            width="24"
            height="24"
            viewBox="0 0 60 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.3636 10.9091H10.9091V16.3636H16.3636V10.9091Z" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 4C0 1.79086 1.79086 0 4 0H27.2727V27.2727H0V4ZM5.45455 5.45455H21.8182V21.8182H5.45455V5.45455Z"
            />
            <path d="M10.9091 43.6364H16.3636V49.0909H10.9091V43.6364Z" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 32.7273H27.2727V60H4C1.79086 60 0 58.2091 0 56V32.7273ZM5.45455 38.1818H21.8182V54.5455H5.45455V38.1818Z"
            />
            <path d="M43.6364 10.9091H49.0909V16.3636H43.6364V10.9091Z" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M32.7273 0V27.2727H60V4C60 1.79086 58.2091 0 56 0H32.7273ZM54.5455 5.45455H38.1818V21.8182H54.5455V5.45455Z"
            />
            <path d="M49.0909 32.7273H32.7273V38.1818H43.6364V43.6364H49.0909V32.7273Z" />
            <path d="M43.6364 54.5455V60H32.7273V54.5455H43.6364Z" />
            <path d="M49.0909 54.5455H43.6364V49.0909H49.0909V54.5455Z" />
            <path d="M49.0909 54.5455H60V56C60 58.2091 58.2091 60 56 60H49.0909V54.5455Z" />
            <path d="M54.5455 32.7273H60V38.1818H54.5455V32.7273Z" />
            <path d="M54.5455 43.6364H60V49.0909H54.5455V43.6364Z" />
            <path d="M38.1818 43.6364H32.7273V49.0909H38.1818V43.6364Z" />
          </svg>
        </QrButton>
        <Button disabled={!showAccount || web3Provider} onClick={login}>
          Sign-in
        </Button>
      </Container>
    </>
  )
}

AuthenticateButton.propTypes = {
  web3Provider: PropTypes.func.isRequired,
  showAccount: PropTypes.bool.isRequired,
  onProvider: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
}

const Container = styled.div`
  display: flex;
  flex-direction: horizontal;
`

const Button = styled(ActionButton)`
  margin: 5px;
  height: 40px;
`

const QrButton = styled(Button)`
  display: grid;
  padding-left: 5px;
  padding-right: 5px;
  align-items: center;
  justify-items: center;
`

export default AuthenticateButton
