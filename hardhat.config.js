require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require('hardhat-deploy');
require("ethereum-waffle")
// require("@nomicfoundation/hardhat-chai-matchers");
/**
 * @type import('hardhat/config').HardhatUserConfig
 * 
 */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP = process.env.COINMARKETCAP

module.exports = {
  defaultNetwork: "hardhat",
  
  
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
  },
  
   sepolia:{
    url:SEPOLIA_RPC_URL,
    accounts:[PRIVATE_KEY],
    chainId:11155111,
    blockconfirmations:6,

   }
 
  },
  // solidity: "0.8.4",
  solidity:{
    compilers:[{version:"0.8.4"},{version:"0.6.6"}],

    },
  gasReporter: {
    enabled:true,
    outputFile:"gasReporter.txt",
    noColors:true,
    currency:"USD",
    coinmarketcap:COINMARKETCAP,
    token:"ETH"
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
        default: 0,
    },
    user: {
        default: 1,
    },
},
};
