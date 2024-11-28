// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AlexToken is ERC20 {
    address owner = msg.sender;
    uint256 private _totalSupply;
    uint256 public constant MAX_SUPPLY = 10000000 * 10 ** 18; // 10MM
    
    event TokensBurned(address indexed burner, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);

    constructor(uint256 INITIAL_SUPPLY) ERC20("Alex Token", "AT") {  
        owner = msg.sender;
        _mint(msg.sender, INITIAL_SUPPLY);
        _totalSupply = INITIAL_SUPPLY;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

     function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);

    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);

    }

    function getCurrentSupply() public view returns (uint256) {
        return _totalSupply;
    }

}
