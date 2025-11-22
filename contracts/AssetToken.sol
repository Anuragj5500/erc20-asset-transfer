// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract AssetToken is ERC20, Ownable {
// Each registered asset gets a separate token *contract* in some designs.
// For this starter, a single ERC20 instance will be used to represent units
// across assets; AssetCustody maps assetIds to amounts if needed.


constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}


function mint(address to, uint256 amount) external onlyOwner {
_mint(to, amount);
}


function burn(address from, uint256 amount) external onlyOwner {
_burn(from, amount);
}
}