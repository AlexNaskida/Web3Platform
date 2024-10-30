import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("hardhat-gas-reporter");

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  // gasReporter: {
  //   enabled: true,
  //   currency: 'USD',
  // }
  networks: {
    hardhat: {
      accounts: [
        // Create accounts with a balance of 0 ETH
        {
          privateKey:
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          balance: "1000000000000000000000",
        }, // Account 1
        {
          privateKey:
            "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
          balance: "100000000000000000000",
        }, // Account 2
        {
          privateKey:
            "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
          balance: "10000000000000000000",
        }, // Account 3
      ],
    },
  },
};

export default config;
