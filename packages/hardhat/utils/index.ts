import fs from 'fs';
import { networkConfig } from '../helper-hardhat-config';

const deploymentsDir = './deployments';

const getJSON = (filePath: string) => {
  const contract = fs.readFileSync(filePath).toString();
  return JSON.parse(contract);
};

const getDeployedContract = (contractName: string, newtworkName: string) => {
  return getJSON(`${deploymentsDir}/${newtworkName}/${contractName}.json`);
};

const getMaticUSDCAddress = (networkName: string) => {
  return networkName === 'matic'
    ? networkConfig
    : getDeployedContract('USDC', networkName).address;
};

export { getDeployedContract, getJSON, getMaticUSDCAddress };
