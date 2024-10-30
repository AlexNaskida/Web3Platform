import contractABI from "../assets/Smartcontract.json";
import Web3 from "web3";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const web3 = new Web3("http://127.0.0.1:8545");
export const contract = new web3.eth.Contract(contractABI.abi, contractAddress);
