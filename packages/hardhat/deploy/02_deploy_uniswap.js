// deploy/02_deploy_uniswap.js
const utils = require("../utils");
const { ethers } = require("hardhat");

module.exports = async ({ deployments, network }) => {
  console.info("Deploying Uniswap");
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const peronioAddress = utils.getDeployedContract(
    "Peronio",
    network.name
  ).address;

  const factoryContract = await deploy("Factory", {
    contract: "UniswapV2Factory",
    from: deployer,
    log: true,
    args: [deployer],
  });

  const routerContract = await deploy("Router", {
    contract: "UniswapV2Router02",
    from: deployer,
    log: true,
    args: [
      factoryContract.address,
      "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    ],
  });
};

module.exports.tags = ["Factory", "Router"];
