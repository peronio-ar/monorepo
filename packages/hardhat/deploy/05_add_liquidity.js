// deploy/05_add_liquidity.js
const utils = require("../utils");
const fs = require("fs");
const { ethers } = require("hardhat");
const { defaultValues } = require("../helper-hardhat-config");

module.exports = async ({ deployments, network }) => {
  console.info("Adding Liquidity");
  const { get } = deployments;
  const { deployer } = await getNamedAccounts();

  // Get Artifacts
  const peronioArtifact = await get("Peronio");
  const usdcArtifact = await get("USDC");
  const routerArtifact = await get("Router");

  // Get Contracts on chain
  const peronio = await ethers.getContractAt(
    peronioArtifact.abi,
    peronioArtifact.address
  );
  const usdc = await ethers.getContractAt(
    usdcArtifact.abi,
    usdcArtifact.address
  );
  const router = await ethers.getContractAt(
    routerArtifact.abi,
    routerArtifact.address
  );

  // Set values
  const totalUSDC = defaultValues.collateralAmount;
  const totalPER = defaultValues.collateralAmount.mul(
    defaultValues.collateralRatio
  );

  // Set approval limit
  await usdc.approve(routerArtifact.address, totalUSDC);
  await peronio.approve(routerArtifact.address, totalPER);

  await router.addLiquidity(
    usdcArtifact.address,
    peronioArtifact.address,
    totalUSDC,
    totalPER,
    totalUSDC,
    totalPER,
    deployer,
    9999999999
  );

  console.info("Added Liquidity");

  //   const usdcAddress = utils.getDeployedContract("Factory", network.name).address;
  //   const peronioAddress = utils.getDeployedContract(
  //     "Peronio",
  //     network.name
  //   ).address;

  //   // Contracts
  //   const usdc = await ethers.getContractAt("IERC20", usdcAddress);
  //   const peronio = await ethers.getContractAt("UniswapV2Factory", peronioAddress);

  //   await usdc.approve(peronioAddress, COLLATERAL_AMOUNT);
  //   await usdc.transfer(peronioAddress, COLLATERAL_AMOUNT);
  //   const balance = await usdc.balanceOf(peronioAddress);

  //   // console.info("balance", ethers.utils.formatEther(ethers.balance));
  //   await peronio.initiliaze(COLLATERAL_AMOUNT, COLLATERAL_RATIO);
};

module.exports.tags = ["Pair"];
