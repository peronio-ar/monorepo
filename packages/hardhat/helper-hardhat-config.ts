const { ethers } = require('hardhat');

const networkConfig = {
  default: {
    name: 'hardhat',
  },
  31337: {
    name: 'localhost',
  },
  1: {
    name: 'mainnet',
    //usdcToken: '0x...',
  },
  80001: {
    name: 'mumbai',
    //usdcToken: '0x...',
  },
  137: {
    name: 'polygon',
    usdcToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
};

const defaultValues = {
  collateralAmount: ethers.utils.parseEther('100'),
  collateralRatio: 185,
};

const developmentChains = ['hardhat', 'localhost'];

export { networkConfig, developmentChains, defaultValues };
