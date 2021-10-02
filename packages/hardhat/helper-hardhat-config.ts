import { BigNumber } from '@ethersproject/bignumber';

const { ethers } = require('hardhat');

interface INetworkConfig {
  [k: string]: { name: string };
}
const networkConfig: INetworkConfig = {
  default: {
    name: 'hardhat',
  },
  '31337': {
    name: 'localhost',
  },
  '1': {
    name: 'mainnet',
  },
  '80001': {
    name: 'mumbai',
  },
  '137': {
    name: 'polygon',
  },
};

interface IDefaultValues {
  collateralAmount: BigNumber;
  collateralRatio: number;
}

const defaultValues: IDefaultValues = {
  collateralAmount: ethers.utils.parseUnits('1', 6),
  collateralRatio: 182,
};

const developmentChains = ['hardhat', 'localhost'];

export { networkConfig, developmentChains, defaultValues };
