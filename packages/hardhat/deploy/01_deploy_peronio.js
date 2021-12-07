// deploy/01_deploy_contracts.js
const utils = require("../utils");
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const usdtContract = utils.getDeployedContract("USDT", network.name);
  const amUsdtContract = utils.getDeployedContract("amUSDT", network.name);
  const aaveLendingPool = utils.getDeployedContract(
    "LendingPool",
    network.name
  );

  await deploy("Peronio", {
    contract: "ERC20Collateral",
    from: deployer,
    log: true,
    args: [
      "Peronio Fake",
      "PER",
      usdtContract.address,
      amUsdtContract.address,
      aaveLendingPool.address,
    ],
  });
};

module.exports.tags = ["Peronio"];
