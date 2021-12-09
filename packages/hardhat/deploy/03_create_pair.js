// deploy/03_create_pair.js
const utils = require("../utils");
const fs = require("fs");
const { ethers } = require("hardhat");

module.exports = async ({ deployments, network }) => {
  console.info("Creating Pair");
  const { getArtifact, save } = deployments;

  const addresses = {
    usdt: utils.getDeployedContract("USDT", network.name).address,
    peronio: utils.getDeployedContract("Peronio", network.name).address,
    factory: utils.getDeployedContract("Factory", network.name).address,
    router: utils.getDeployedContract("Router", network.name).address,
  };
  const contracts = {
    usdt: await ethers.getContractAt("IERC20", addresses.usdt),
    peronio: await ethers.getContractAt("ERC20Collateral", addresses.peronio),
    factory: await ethers.getContractAt("UniswapV2Factory", addresses.factory),
    router: await ethers.getContractAt("UniswapV2Router02", addresses.factory),
  };

  const currentPair = await contracts.factory.getPair(
    addresses.usdt,
    addresses.peronio
  );

  if (currentPair !== "0x0000000000000000000000000000000000000000") {
    console.info("Pair already exists");
    return;
  }

  try {
    await contracts.factory.createPair(addresses.usdt, addresses.peronio);
    console.info("Created pair PER/USDT");
  } catch (e) {
    console.error("Error while trying to create pair");
    throw e;
  }

  addresses.pair = await contracts.factory.getPair(
    addresses.usdt,
    addresses.peronio
  );

  const pairArtifact = await getArtifact("UniswapV2Pair");

  console.info("Pair created on address:", addresses.pair);
  // Save Deployment
  save(
    "PairPeronioUSDT",
    Object.assign({ address: addresses.pair }, pairArtifact)
  );
};

module.exports.tags = ["Pair"];
