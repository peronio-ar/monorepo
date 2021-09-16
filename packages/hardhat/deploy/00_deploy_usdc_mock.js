// deploy/00_deploy_usdc_mock.js

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  if (network.name === "matic") {
    console.info("MATIC main network detected");
    console.info("Skipping USDC mock contract");
    return;
  }

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("YourContract", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });

  console.info("Deploy USDC mock");
  await deploy("USDC", {
    contract: "ERC20",
    from: deployer,
    log: true,
    args: ["USD Coin", "USDC"],
  });
};
module.exports.tags = ["YourContract", "USDC"];
