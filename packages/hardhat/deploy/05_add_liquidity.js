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
  const usdtArtifact = await get("USDT");
  const routerArtifact = await get("Router");

  // Get Contracts on chain
  const peronio = await ethers.getContractAt(
    peronioArtifact.abi,
    peronioArtifact.address
  );
  const usdt = await ethers.getContractAt(
    usdtArtifact.abi,
    usdtArtifact.address
  );
  const router = await ethers.getContractAt(
    routerArtifact.abi,
    routerArtifact.address
  );

  // Set values
  const totalUSDT = defaultValues.collateralAmount;
  const totalPER = defaultValues.collateralAmount.mul(
    defaultValues.collateralRatio
  );

  // Set approval limit
  await usdt.approve(routerArtifact.address, totalUSDT);
  await peronio.approve(routerArtifact.address, totalPER);

  console.info("DEBUG");
  console.dir({
    usdAddress: usdtArtifact.address,
    peronioAddress: peronioArtifact.address,
    totalUSDT,
    totalPER,
    totalUSDT,
    totalPER,
    deployer,
  });
  await router.addLiquidity(
    usdtArtifact.address,
    peronioArtifact.address,
    totalUSDT,
    totalPER,
    totalUSDT,
    totalPER,
    deployer,
    9999999999
  );

  console.info("Added Liquidity");
};

module.exports.tags = ["Pair"];
