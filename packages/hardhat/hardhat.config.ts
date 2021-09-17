// import { task } from 'hardhat/config';

// import utils from 'ethers';
import fs from 'fs';

import '@nomiclabs/hardhat-waffle';
import '@tenderly/hardhat-tenderly';

import 'hardhat-deploy';

import '@eth-optimism/hardhat-ovm';
import '@nomiclabs/hardhat-ethers';

//
// Select the network you want to deploy to here:
//
const defaultNetwork = 'localhost';

// const mainnetGwei = 21;

function mnemonic() {
  try {
    return fs.readFileSync('./mnemonic.txt').toString().trim();
  } catch (e) {
    if (defaultNetwork !== 'localhost') {
      console.log(
        '☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.'
      );
    }
  }
  return '';
}

const Private_Key =
  '4d0b2f81ad8500f469c134437cdabdd72898b31fbb144b33893e701fc18622de';

module.exports = {
  defaultNetwork,

  networks: {
    localhost: {
      url: 'http://localhost:8545',
      accounts: [`${Private_Key}`],
      /*      
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      
      */
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  ovm: {
    solcVersion: '0.7.6',
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
};
