const { ethers } = require("hardhat");

async function main() {
  const tokenAddress = "PASTE_YOUR_TOKEN_ADDRESS_HERE"; // <-- Replace this

  // Get Hardhat test accounts
  const [owner, receiver] = await ethers.getSigners();

  console.log("Owner Wallet:", owner.address);
  console.log("Receiver Wallet:", receiver.address);

  // Load the ERC20 token contract
  const token = await ethers.getContractAt("AssetToken", tokenAddress, owner);

  const amountToSend = "50"; // Tokens to transfer
  const decimals = await token.decimals();
  const amount = ethers.parseUnits(amountToSend, decimals);

  console.log(`⏳ Sending ${amountToSend} tokens to ${receiver.address}...`);

  const tx = await token.transfer(receiver.address, amount);
  await tx.wait();

  console.log(`✅ SUCCESS: ${amountToSend} tokens transferred!`);
  console.log("Tx Hash:", tx.hash);
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ ERROR:", error);
    process.exit(1);
  });
