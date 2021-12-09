// deploy/05_add_liquidity.js
const utils = require("../utils");
const fs = require("fs");
const { ethers } = require("hardhat");
const { defaultValues } = require("../helper-hardhat-config");

module.exports = async ({ deployments, network }) => {
  console.info("Liquidity Pool");
  const { get } = deployments;
  const { deployer } = await getNamedAccounts();

  // Get Artifacts
  const peronioArtifact = await get("Peronio");
  const usdtArtifact = await get("USDT");
  const amUsdtArtifact = await get("amUSDT");
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
  const totalUSDT = defaultValues.collateralStartingLiquidity;
  const totalPER = defaultValues.collateralStartingLiquidity.mul(
    defaultValues.collateralRatio
  );

  // Set approval limit
  console.info("Approving USDT...");
  await usdt.approve(routerArtifact.address, totalUSDT);
  console.info("Approving PER...");
  await peronio.approve(routerArtifact.address, totalPER);

  console.info("Adding Liquidity...");
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

  console.info("---- RESULTS ----");
  console.dir({
    usdtAddress: usdtArtifact.address,
    amUsdtAddress: amUsdtArtifact.address,
    peronioAddress: peronioArtifact.address,

    totalUSDT: parseFloat(ethers.utils.formatUnits(totalUSDT, 6)),
    totalPER: parseFloat(ethers.utils.formatUnits(totalPER, 6)),
    deployer,
  });
};

module.exports.tags = ["Pair"];
