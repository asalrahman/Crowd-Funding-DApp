const { ethers, deployments, getNamedAccounts,network} = require("hardhat");
const { assert, expect } = require("chai");
const {developmentChains} = require("../../helpers-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
:describe("FundMe", () => {
  let fundMe;
  let deployer;
  const sendValue = ethers.utils.parseEther("1"); // = 1 eth

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer;
    await deployments.fixture(["all"]); //it deploy all contracts
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", () => {
    it("sets aggregator address correctly", async () => {
      const response = await fundMe.getPriceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });

  describe("fund", () => {
    it("fails if we dont send enough eth", async () => {
    //   await expect(fundMe.fund()).to.be.revertedWith("Not enough eth");
    await expect(fundMe.fund()).to.be.reverted
    });
  });

  it("Updates the amount funded data structure", async () => {
    await fundMe.fund({ value: sendValue });
    const response = await fundMe.getAddressToAmountFunded(deployer);
    assert.equal(response.toString(), sendValue.toString());
  });

  it("adds getFunders to array of getFunders", async () => {
    await fundMe.fund({ value: sendValue });
    const getFunders = await fundMe.getFunders(0);
    assert.equal(getFunders, deployer);
  });

  describe("withdraw", () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue }); // send money to fund
    });

    it("withdraw ETH from single funder", async () => {
      // define both balances
      const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
      const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

      // withdraw
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt; // use debugger
      const gasCost = gasUsed.mul(effectiveGasPrice);

      // ending balances
      const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

      // assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance).toString(),
        endingDeployerBalance.add(gasCost).toString()
      );
    });

    it("allows to withdraw all multiple getFunders", async () => {
        // Loop through all accounts and send eth
        const accounts = await ethers.getSigners();
        for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(
                accounts[i]
            )
            await fundMeConnectedContract.fund({ value: sendValue })
        }
      
        // Define both balances
        const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const startingDeployerBalance = await fundMe.provider.getBalance(deployer);
      
        // Withdraw
        const transactionResponse = await fundMe.withdraw();
        const transactionReceipt = await transactionResponse.wait();
        const { gasUsed, effectiveGasPrice } = transactionReceipt; // Use debugger
        const gasCost = gasUsed.mul(effectiveGasPrice);
      
        // Ending balances
        const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
      
        // Assert
        assert.equal(
          startingFundMeBalance.add(startingDeployerBalance).toString(),
          endingDeployerBalance.add(gasCost).toString()
        );
      
        // Make sure all getFunders reset properly
        await expect(fundMe.getFunders(0)).to.be.reverted;
      
        for (let i = 1; i < 6; i++) {
          assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address), 0);
        }
      });
      
      

    it("Only allows the owner to withdraw", async function () {
      const accounts = await ethers.getSigners();
      const fundMeConnectedContract = await fundMe.connect(accounts[1]);
      await expect(fundMeConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner");
    });

    it("cheaper withdraw.....", async () => {
        // Loop through all accounts and send eth
        const accounts = await ethers.getSigners();
        for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(
                accounts[i]
            )
            await fundMeConnectedContract.fund({ value: sendValue })
        }
      
        // Define both balances
        const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const startingDeployerBalance = await fundMe.provider.getBalance(deployer);
      
        // Withdraw
        const transactionResponse = await fundMe.cheaperWithdraw();
        const transactionReceipt = await transactionResponse.wait();
        const { gasUsed, effectiveGasPrice } = transactionReceipt; // Use debugger
        const gasCost = gasUsed.mul(effectiveGasPrice);
      
        // Ending balances
        const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
        const endingDeployerBalance = await fundMe.provider.getBalance(deployer);
      
        // Assert
        assert.equal(
          startingFundMeBalance.add(startingDeployerBalance).toString(),
          endingDeployerBalance.add(gasCost).toString()
        );
      
        // Make sure all getFunders reset properly
        await expect(fundMe.getFunders(0)).to.be.reverted;
      
        for (let i = 1; i < 6; i++) {
            assert.isTrue(endingFundMeBalance.isZero(), "Ending FundMe balance should be zero");

        }
      });
  });
});
