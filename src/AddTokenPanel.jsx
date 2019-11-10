import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SwitchNetworkNotice from './SwitchNetworkNotice'
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DownloadMetaMaskButton from './DownloadMetaMaskButton';
import Eth from 'ethjs-query';
import logo from './coin.jpg';
import queryString from 'querystringify'

const metaMarkAddress = '0x6a4b6316D1d03d2f2B3A0294502F8fAF0F38cA14';

class AddTokenPanel extends Component {

  constructor (props) {
    const {
      tokenName = 'Hertz',
        tokenSymbol = 'HZ',
        tokenDecimals = 18,
        totalSupply = '21,000.00',
        tokenAddress = metaMarkAddress,
        tokenImage = 'https://raw.githubusercontent.com/olejardamir/Hertz/master/roundLogo_400by400.png',
        tokenNet = '1',
        message = '',
        errorMessage = '',
        net = '1',
    } = props

    super()
    this.state = {
      tokenName,
      tokenSymbol,
      tokenDecimals,
      totalSupply,
      tokenAddress,
      tokenImage,
      tokenNet,
      message,
      errorMessage,
      net,
    }

    const search = window.location.search
    const params = queryString.parse(search)

    for (let key in params) {
      this.state[key] = params[key]
    }

    this.updateNet()
  }

  componentDidMount() {
    const search = this.props.location.search
    const params = queryString.parse(search)
    this.setState(params)
  }

  async updateNet () {
    const provider = window.web3.currentProvider
    const eth = new Eth(provider)
    const realNet = await eth.net_version()
    this.setState({ net: realNet })
  }

  render (props, context) {
    const {
      tokenName,
      tokenSymbol,
      tokenDecimals,
      totalSupply,
      tokenNet,
      net,
      tokenImage,
      tokenAddress,
      message,
      errorMessage,
    } = this.state

    let error
    if (errorMessage !== '') {
      error = <p className="errorMessage">
        There was a problem adding this token to your wallet. Make sure you have the latest version of MetaMask installed!
        <DownloadMetaMaskButton/>
      </p>
    }

    if (tokenNet !== net) {
      return <SwitchNetworkNotice net={net} tokenNet={tokenNet}/>
    }

    return (
      <div className="values">
        <header className="App-header">
          <img src={tokenImage || logo} className="logo" alt="Coin"/>
          <h1 className="App-title">Add {tokenName} to Metamask: </h1>
        </header>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>{tokenSymbol}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Decimals</TableCell>
              <TableCell>{tokenDecimals}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Supply</TableCell>
              <TableCell>{totalSupply}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div><br/><br/><br/></div>
        <div>
          <Button
            onClick = {async (event) => {
              const provider = window.web3.currentProvider
              provider.sendAsync({
                method: 'metamask_watchAsset',
                params: {
                  "type":"ERC20",
                  "options":{
                    "address": tokenAddress,
                    "symbol": tokenSymbol,
                    "decimals": tokenDecimals,
                    "image": tokenImage,
                  },
                },
                id: Math.round(Math.random() * 100000),
              }, (err, added) => {
                console.log('provider returned', err, added)
                if (err || 'error' in added) {
                  this.setState({
                    errorMessage: 'There was a problem adding the token.',
                    message: '',
                  })
                  return
                }
                this.setState({
                  message: '',
                  errorMessage: '',
                })
              })
            }}
          >Click here to add to MetaMask</Button>
        </div>

        <p>{message}</p>
        {error}

        <div>
          <a href="https://github.com/olejardamir/addHertzMetamask" >Click here to see the source-code</a>
        </div>

        <div className="spacer"></div>



      </div>
    )
  }
}

AddTokenPanel.contextTypes = {
  web3: PropTypes.object,
}

export default AddTokenPanel;

