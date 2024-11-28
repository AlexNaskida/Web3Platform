import contractABI from "@/assets/Smartcontract.json";
import alexTokenABI from "@/assets/AlexToken.json";
import Web3 from "web3";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const alexTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const web3 = new Web3("http://127.0.0.1:8545");
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
const alexTokenContract = new web3.eth.Contract(
  alexTokenABI.abi,
  alexTokenAddress
);

export { contract, alexTokenContract, contractAddress, alexTokenAddress };
