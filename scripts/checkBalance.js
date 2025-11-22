const { ethers } = require("hardhat");

async function main() {
  const tokenAddress = "PASTE_YOUR_TOKEN_ADDRESS_HERE"; // <-- Replace this

  const [owner, user1] = await ethers.getSigners();

  const token = await ethers.getContractAt("AssetToken", tokenAddress);

  const decimals = await token.decimals();

  const balOwner = await token.balanceOf(owner.address);
  const balUser1 = await token.balanceOf(user1.address);

  console.log("Balance of Owner:", ethers.formatUnits(balOwner, decimals));
  console.log("Balance of User1:", ethers.formatUnits(balUser1, decimals));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ ERROR:", error);
    process.exit(1);
  });
