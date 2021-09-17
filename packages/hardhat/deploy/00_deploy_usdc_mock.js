// deploy/00_deploy_usdc_mock.js
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  if (network.name === "matic") {
    console.info("MATIC main network detected");
    console.info("Skipping USDC mock contract");
    return;
  }

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await network.provider.send("hardhat_setBalance", [
    deployer,
    "0x" + (100000 >>> 0).toString(2),
  ]);

  await deploy("YourContract", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });

  await deploy("USDC", {
    contract: "USDCMock",
    from: deployer,
    log: true,
    args: [ethers.utils.parseEther("10000")],
  });
};
module.exports.tags = ["YourContract", "USDC"];
