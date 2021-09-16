import fs from 'fs';
const deploymentsDir = './deployments';
const USDCMainnetAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

const getJSON = (filePath: string) => {
  const contract = fs.readFileSync(filePath).toString();
  return JSON.parse(contract);
};

const getDeployedContract = (contractName: string, newtworkName: string) => {
  return getJSON(`${deploymentsDir}/${newtworkName}/${contractName}.json`);
};

const getMaticUSDCAddress = (networkName: string) => {
  return networkName === 'matic'
    ? USDCMainnetAddress
    : getDeployedContract('USDC', networkName).address;
};

export { getDeployedContract, getJSON, getMaticUSDCAddress };
