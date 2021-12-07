const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Contract tests", function () {
  let usdtContract, amUsdtContract, lendingContract;

  describe("ERC20 Mock Tokens", function () {
    it("Should deploy USDT Mock", async function () {
      const USDTMock = await ethers.getContractFactory("ERC20Mock");
      usdtContract = await USDTMock.deploy(
        "USDT Mock",
        "USDT",
        ethers.utils.parseUnits("10000", 6)
      );
      return;
    });

    it("Should deploy USDT Mock", async function () {
      const aUSDTMock = await ethers.getContractFactory("ERC20Mock");

      amUsdtContract = await aUSDTMock.deploy(
        "amUSDT Mock",
        "amUSDT",
        ethers.utils.parseUnits("10000", 6)
      );
      return;
    });
  });

  describe("LendingPoolMock", function () {
    it("Should deploy Lending Pool", async function () {
      const LendingPoolContract = await ethers.getContractFactory(
        "LendingPoolMock"
      );

      lendingContract = await LendingPoolContract.deploy(
        amUsdtContract.address
      );
      return;
    });

    describe("deposit()", function () {
      it("Should be able to allow LendingPool as amUSDT spender", async function () {
        const [owner] = await ethers.getSigners();
        // expect(await lendingContract.purpose()).to.equal(newPurpose);
        await amUsdtContract.approve(
          lendingContract.address,
          ethers.utils.parseUnits("10000", 6)
        );
      });

      it("Should be able to deposit into LendingPool", async function () {
        const [owner] = await ethers.getSigners();
        // expect(await lendingContract.purpose()).to.equal(newPurpose);

        await lendingContract.deposit(
          amUsdtContract.address,
          ethers.utils.parseUnits("100", 6),
          owner.address,
          0
        );
      });
    });
  });
});
