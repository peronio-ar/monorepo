import fs from 'fs';
const deploymentsDir = './deployments';

const getJSON = (filePath: string) => {
  const contract = fs.readFileSync(filePath).toString();
  return JSON.parse(contract);
};

const getDeployedContract = (contractName: string, newtworkName: string) => {
  return getJSON(`${deploymentsDir}/${newtworkName}/${contractName}.json`);
};

export { getDeployedContract, getJSON };
