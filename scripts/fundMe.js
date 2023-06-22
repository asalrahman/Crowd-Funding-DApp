const { getContractAddress } = require("ethers/lib/utils")
const { getNamedAccounts, ethers } = require("hardhat")

// funding locally 
async function main(){
    const {deployer} = await getNamedAccounts()
     const fundMe = await ethers.getContract("FundMe", deployer);

    console.log(`get contract address ${fundMe.address}`);
    console.log("funding....");
    const transactionResponse = await fundMe.fund({value:ethers.utils.parseEther("0.1")})
    transactionResponse.wait(1);
    console.log("funded");
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })