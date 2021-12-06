// deploy/01_deploy_contracts.js
const utils = require("../utils");
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const usdtAddress = utils.getDeployedContract("USDT", network.name).address;
  const amUsdtAddress = utils.getDeployedContract(
    "amUSDT",
    network.name
  ).address;

  await deploy("Peronio", {
    contract: "ERC20Collateral",
    from: deployer,
    log: true,
    args: ["Peronio", "PER", usdcAddress],
  });
};

module.exports.tags = ["Peronio"];
