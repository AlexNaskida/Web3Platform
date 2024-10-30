// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Staking {
    address public owner;
    mapping(bytes32 => address) public whiteListedTokens; // Stores the tokens that are acceptred for staking
    mapping(address => mapping(bytes32 => uint256)) public accountBalances;
// accountBalances
// |
// |-- User1 (address)
// |     |
// |     |-- TokenA (bytes32) --> 100 (uint256)
// |     |
// |     |-- TokenB (bytes32) --> 50 (uint256)
// |
// |-- User2 (address)
//       |
//       |-- TokenA (bytes32) --> 200 (uint256)
//       |
//       |-- TokenC (bytes32) --> 75 (uint256)

    constructor() {
        owner = msg.sender;
    }

    function Stake(bytes32 symbol, address tokenAddress) external {
        require(msg.sender == owner, "Only owner can stake");
        whiteListedTokens[symbol] = tokenAddress;
    }


    function depositTokens(uint256 amount, bytes32 symbol) external {
        accountBalances[msg.sender][symbol] += amount;
        ERC20(whiteListedTokens[symbol]).transferFrom(msg.sender, address(this), amount);
    }


    function withdrawTokens(uint256 amount, bytes32 symbol) external {
        require(accountBalances[msg.sender][symbol] >= amount, "Insufficient funds");
        accountBalances[msg.sender][symbol] -= amount;
        ERC20(whiteListedTokens[symbol]).transfer(msg.sender, amount);
    }

}