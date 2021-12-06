// deploy/00_deploy_usdc_mock.js
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const { getArtifact, save } = deployments;

  if (network.name === "localhost") {
    console.info("Funding hardhat");
    await network.provider.send("hardhat_setBalance", [
      deployer,
      "0x" + (100000 >>> 0).toString(2),
    ]);
  }

  if (network.config.usdcToken) {
    console.info("USDT Token detected");
    console.info("Skipping USDT mock contract deploy");

    const usdcArtifact = await getArtifact("USDTMock");

    // Save Deployment
    save(
      "USDT",
      Object.assign({ address: network.config.usdcToken }, usdcArtifact)
    );
    save(
      "amUSDT",
      Object.assign({ address: network.config.amUsdtToken }, usdcArtifact)
    );
    return;
  }

  await deploy("USDT", {
    contract: "USDCMock",
    from: deployer,
    log: true,
    args: [ethers.utils.parseUnits("10000", 6)],
  });

  await deploy("amUSDT", {
    contract: "USDCMock",
    from: deployer,
    log: true,
    args: [0],
  });
};
module.exports.tags = ["YourContract", "USDT"];
