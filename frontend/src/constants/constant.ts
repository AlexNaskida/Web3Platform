import contractABI from "@/assets/Smartcontract.json";
import alexTokenContractABI from "@/assets/AlexToken.json";

import NFTContractABI from "@/assets/NFTSmartcontract.json";
import marketPlaceContractABI from "@/assets/Marketplace.json";

import Web3 from "web3";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const alexTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const NFTContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const MarketPlaceAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const web3 = new Web3("http://127.0.0.1:8545");
// const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
const alexTokenContract = new web3.eth.Contract(
  alexTokenContractABI.abi,
  alexTokenAddress
);
const NFTContract = new web3.eth.Contract(
  NFTContractABI.abi,
  NFTContractAddress
);
const MarketPlaceContract = new web3.eth.Contract(
  marketPlaceContractABI.abi,
  MarketPlaceAddress
);

export {
  contract,
  alexTokenContract,
  NFTContract,
  MarketPlaceContract,
  contractAddress,
  alexTokenAddress,
  NFTContractAddress,
  MarketPlaceAddress,
};
