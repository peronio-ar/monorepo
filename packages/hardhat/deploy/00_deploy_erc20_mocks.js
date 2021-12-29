// deploy/00_deploy_erc20_mocks.js

const { ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { getArtifact, save } = deployments;

  // Only for mainchain
  if (!developmentChains.includes(network.name)) {
    console.info("Polygon Network selected");
    console.info("Skipping USDT mock contract deploy");

    const erc20Artifact = await getArtifact("ERC20Mock");

    // Save Deployment
    save(
      "WMATIC",
      Object.assign({ address: process.env.WMATIC_ADDRESS }, erc20Artifact)
    );
    save(
      "USDT",
      Object.assign({ address: process.env.USDT_ADDRESS }, erc20Artifact)
    );
    save(
      "amUSDT",
      Object.assign({ address: process.env.AMUSDT_ADDRESS }, erc20Artifact)
    );
    save(
      "LendingPool",
      Object.assign(
        { address: process.env.AAVE_LENDING_POOL_ADDRESS },
        erc20Artifact
      )
    );
    return;
  }

  // Only for development chain
  console.info("Funding hardhat");
  await network.provider.send("hardhat_setBalance", [
    deployer,
    "0x" + (100000 >>> 0).toString(2),
  ]);

  // Deploy Mock Contracts
  await deploy("WMATIC", {
    contract: "ERC20Mock",
    from: deployer,
    log: true,
    args: ["WMATIC Mock", "WMATIC", ethers.utils.parseUnits("10000", 6)],
  });

  await deploy("USDT", {
    contract: "ERC20Mock",
    from: deployer,
    log: true,
    args: ["USDT Mock", "USDT", ethers.utils.parseUnits("20000", 6)],
  });

  const amUSDT = await deploy("amUSDT", {
    contract: "ERC20Mock",
    from: deployer,
    log: true,
    args: ["amUSDT Mock", "amUSDT", 0],
  });

  await deploy("LendingPool", {
    contract: "LendingPoolMock",
    from: deployer,
    log: true,
    args: [amUSDT.address],
  });
};
module.exports.tags = ["USDT", "amUSDT", "LendingPool"];
