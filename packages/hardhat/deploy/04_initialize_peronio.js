// deploy/04_initialize_peronio.js
const utils = require("../utils");
const fs = require("fs");
const { ethers } = require("hardhat");
const { defaultValues } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  console.info("Initializing Peronio contract");

  const { deployer } = await getNamedAccounts();

  const usdcAddress = utils.getDeployedContract("USDC", network.name).address;
  const peronioAddress = utils.getDeployedContract(
    "Peronio",
    network.name
  ).address;

  // Contracts
  const usdc = await ethers.getContractAt("IERC20", usdcAddress);
  const peronio = await ethers.getContractAt("ERC20Collateral", peronioAddress);

  // Check if contract is already initialized
  console.info("Checking if contract is already initialized...");
  const initialized = await peronio.initialized();
  if (initialized) {
    console.info("Already Initialized");
    return;
  }

  console.info("Checking if there is enough USDC...");
  const usdcBalance = await usdc.balanceOf(deployer);
  if (usdcBalance.lt(defaultValues.collateralAmount)) {
    throw Error("Not enough USDC funds");
  }
  console.info(
    "Approving USDC " +
      ethers.utils.formatUnits(defaultValues.collateralAmount, 6) +
      " to be spent"
  );
  await usdc.approve(peronioAddress, defaultValues.collateralAmount);
  try {
    console.info("Initializing Contract...");
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
