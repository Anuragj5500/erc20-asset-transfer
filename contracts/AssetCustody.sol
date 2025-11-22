// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/access/Ownable.sol";
import "./AssetToken.sol";


contract AssetCustody is Ownable {
struct Asset {
    string name;              // Name of the property
    string metadataURI;       // More details or documents (IPFS)
    uint256 totalTokenSupply; // How many tokens represent the asset
    uint256 propertyValue;    // Real-world value (in INR, USD, etc.)
    bool exists;
    bool redeemed;
}


AssetToken public token;
uint256 public nextAssetId;
mapping(uint256 => Asset) public assets;


event AssetRegistered(uint256 indexed assetId, string metadataURI, uint256 totalTokenSupply);
event AssetRedeemed(uint256 indexed assetId, address indexed redeemer, uint256 burnedAmount);


constructor(address tokenAddress) {
token = AssetToken(tokenAddress);
nextAssetId = 1;
}


function registerAsset(
    string calldata name,
    string calldata metadataURI,
    uint256 totalTokenSupply,
    uint256 propertyValue
) external onlyOwner returns (uint256) {
    require(totalTokenSupply > 0, "supply>0");
    require(propertyValue > 0, "value>0");

    uint256 assetId = nextAssetId++;

    assets[assetId] = Asset({
        name: name,
        metadataURI: metadataURI,
        totalTokenSupply: totalTokenSupply,
        propertyValue: propertyValue,
        exists: true,
        redeemed: false
    });

    // Mint tokens to custody contract
    token.mint(address(this), totalTokenSupply);

    emit AssetRegistered(assetId, metadataURI, totalTokenSupply);
    return assetId;
}


// Transfer tokens representing asset units to buyers
function distribute(uint256 amount, address to) external onlyOwner {
require(amount > 0, "amount>0");
token.transfer(to, amount);
}


// Redeem: Burn tokens from redeemer and mark asset redeemed if full supply burned
function redeem(uint256 assetId, uint256 amount) external {
Asset storage a = assets[assetId];
require(a.exists, "asset not found");
require(!a.redeemed, "already redeemed");
require(amount > 0, "amount>0");


// Caller must have approved this contract to burn on their behalf, but our token requires owner-only burn
// We'll implement a pattern: user transfers tokens to this contract, then calls redeem to burn them.
// Check balance sent
uint256 bal = token.balanceOf(address(this));
require(bal >= amount, "insufficient deposited tokens");


// Burn from contract. AssetToken's burn is owner-only, so AssetCustody must be owner of token.
token.burn(address(this), amount);


if (amount >= a.totalTokenSupply) {
a.redeemed = true;
}


emit AssetRedeemed(assetId, msg.sender, amount);


// NOTE: off-chain: owner must transfer the real-world asset to redeemer. Use metadataURI & event for verification.
}
}