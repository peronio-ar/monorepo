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
    args: [peronioAddress],
  });

  const routerContract = await deploy("Router", {
    contract: "UniswapV2Router02",
    from: deployer,
    log: true,
    args: [factoryContract.address, peronioAddress],
  });
};

module.exports.tags = ["Factory", "Router"];
