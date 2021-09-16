// deploy/03_create_pair.js
const utils = require("../utils");
const fs = require("fs");
const { ethers } = require("hardhat");

module.exports = async ({ deployments, network }) => {
  console.info("Deploying Uniswap");
  const { deploy, getArtifact, save } = deployments;

  const { deployer } = await getNamedAccounts();
  const addresses = {
    usdc: utils.getDeployedContract("USDC", network.name).address,
    peronio: utils.getDeployedContract("Peronio", network.name).address,
    factory: utils.getDeployedContract("Factory", network.name).address,
    router: utils.getDeployedContract("Router", network.name).address,
  };
  const contracts = {
    usdc: await ethers.getContractAt("ERC20", addresses.usdc),
    peronio: await ethers.getContractAt("ERC20Collateral", addresses.peronio),
    factory: await ethers.getContractAt("UniswapV2Factory", addresses.factory),
    router: await ethers.getContractAt("UniswapV2Router02", addresses.factory),
  };

  await contracts.factory.createPair(
    contracts.usdc.address,
    contracts.peronio.address
  );

  addresses.pair = await contracts.factory.getPair(
    contracts.usdc.address,
    contracts.peronio.address
  );

  const pairArtifact = await getArtifact("UniswapV2Pair");

  // Save Deployment
  save(
    "PairPeronioUSDC",
    Object.assign({ address: addresses.pair }, pairArtifact)
  );
};

module.exports.tags = ["Pair"];
