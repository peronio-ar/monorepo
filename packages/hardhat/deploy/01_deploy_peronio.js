// deploy/01_deploy_contracts.js
const utils = require("../utils");
const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  let usdcAddress;
  if (network.name === "matic") {
    console.info("Setting USDC official mainnet contract");
    usdcAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  } else {
    console.info("Using USDC Mock");
    usdcAddress = utils.getDeployedContract("USDC", network.name).address;
  }

  await deploy("Peronio", {
    contract: "ERC20Collateral",
    from: deployer,
    log: true,
    args: ["Peronio", "PER", usdcAddress],
  });

  const peronioContract = await ethers.getContract("Peronio", deployer);

  console.dir(peronioContract.address);

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};

module.exports.tags = ["Peronio"];
