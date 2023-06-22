const { assert } = require("chai")
const{getNamedAccounts,ethers, network}=require("hardhat")
const {developmentChains} = require("../../helpers-hardhat-config")


developmentChains.includes(network.name)
    ? describe.skip
:describe("FundMe",()=>{
     let fundMe
     let deployer
     const sendValue = ethers.utils.parseEther("0.1")
    beforeEach(async()=>{

        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer)
    })
    it("allows to people to fund and withdraw",async()=>{
      const fundResponse = await fundMe.fund({value:sendValue});
      await fundResponse.wait(1);
      const withdrawResponse = await fundMe.withdraw();
      await withdrawResponse.wait(1);
      const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
      assert.equal(endingFundMeBalance.toString(),"0");
    })
})