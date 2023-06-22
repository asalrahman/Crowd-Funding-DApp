const { network } = require("hardhat")

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks Deployed!")
        log("------------------------------------------------")
      
    }
}
module.exports.tags = ["all", "mocks"]


// Deploy a fake price feed

// const { network } = require("hardhat");
// const DECIMALS = "8"
// const INITIAL_PRICE = "200000000000"


// module.exports = async ({ deployments, getNamedAccounts }) => {
//   const { log, deploy } = deployments;
//   const { deployer } = getNamedAccounts();
//   const chainId = network.config.chainId;

//   if (chainId == 31337) {
//     log("Local network detected... deploying mocks");
//     await deploy("MockV3Aggregator", {
//       contract: "MockV3Aggregator",
//       from: deployer,
//       log: true,
//       args: [DECIMALS, INITIAL_PRICE]
//     });

//     log("Mocks deployed");
//     log("----------------------------");
//   }
// };

// module.exports.tags = ["all", "mocks"];
