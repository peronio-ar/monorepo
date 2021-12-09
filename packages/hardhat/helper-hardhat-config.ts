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
  collateralStartingLiquidity: number;
}

const defaultValues: IDefaultValues = {
  collateralAmount: ethers.utils.parseUnits(process.env.COLLATERAL_AMOUNT, 6),
  collateralRatio: parseFloat(process.env.COLLATERAL_RATIO || '1'),
  collateralStartingLiquidity: ethers.utils.parseUnits(
    process.env.LIQUIDITY_STARTING_AMOUNT,
    6
  ),
};

const developmentChains = ['hardhat', 'localhost'];

export { networkConfig, developmentChains, defaultValues };
