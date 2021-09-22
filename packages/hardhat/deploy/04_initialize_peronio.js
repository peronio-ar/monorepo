// deploy/04_initialize_peronio.js
const utils = require("../utils");
const fs = require("fs");
const { ethers } = require("hardhat");
const { defaultValues } = require("../helper-hardhat-config");

module.exports = async ({ deployments, network }) => {
  console.info("Initializing Peronio contract");

  const usdcAddress = utils.getDeployedContract("USDC", network.name).address;
  const peronioAddress = utils.getDeployedContract(
    "Peronio",
    network.name
  ).address;

  // Contracts
  const usdc = await ethers.getContractAt("IERC20", usdcAddress);
  const peronio = await ethers.getContractAt("ERC20Collateral", peronioAddress);

  await usdc.approve(peronioAddress, defaultValues.collateralAmount);
  try {
    await peronio.initiliaze(
      defaultValues.collateralAmount,
      defaultValues.collateralRatio
    );
    console.info("Initialized Peronio ERC20");
  } catch (e) {
    if (e.message.indexOf("Contract already initialized") === -1) {
      throw e;
    }
    console.info("Contract already initialized");
  }
};

module.exports.tags = ["Pair"];
