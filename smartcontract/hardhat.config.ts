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
        }, // Account 1 1000 ETH
        {
          privateKey:
            "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
          balance: "100000000000000000000",
        }, // Account 2 100 ETH
        {
          privateKey:
            "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
          balance: "10000000000000000000",
        }, // Account 3 10 ETH
        {
          privateKey:
            "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
          balance: "1000000000000000000",
        }, // Account 4 1 ETH
        {
          privateKey:
            "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
          balance: "0",
        }, // Account 5 0 ETH
        {
          privateKey:
            "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
          balance: "0",
        }, // Account 6 0 ETH
        {
          privateKey:
            "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
          balance: "0",
        }, // Account 7 0 ETH
      ],
    },
  },
};

export default config;
