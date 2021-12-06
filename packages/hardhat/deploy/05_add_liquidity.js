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

  console.info("DEBUG");
  console.dir({
    usdAddress: usdcArtifact.address,
    peronioAddress: peronioArtifact.address,
    totalUSDC,
    totalPER,
    totalUSDC,
    totalPER,
    deployer,
  });
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
};

module.exports.tags = ["Pair"];
