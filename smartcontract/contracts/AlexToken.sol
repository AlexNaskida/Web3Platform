// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlexToken is ERC20, Ownable {
    uint256 private _totalSupply;
    uint256 public constant INITIAL_SUPPLY =  5000000 * 10 ** 18;
    uint256 public constant MAX_SUPPLY = 10000000 * 10 ** 18;
    
    event TokensBurned(address indexed burner, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);

    constructor() ERC20("Alex Token", "AT") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
        _totalSupply = INITIAL_SUPPLY;
    }


    function mint(address to, uint256 amount) public onlyOwner {
        require(_totalSupply + amount <= MAX_SUPPLY, "Would exceed max supply");
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        
        _mint(to, amount);
        _totalSupply += amount;
        
        emit TokensMinted(to, amount);
    }
    
    function burn(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _burn(msg.sender, amount);
        _totalSupply -= amount;
        
        emit TokensBurned(msg.sender, amount);
    }

    function getCurrentSupply() public view returns (uint256) {
        return _totalSupply;
    }
}