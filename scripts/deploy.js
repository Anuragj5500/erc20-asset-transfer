async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", await deployer.getAddress());

  const AssetToken = await ethers.getContractFactory("AssetToken");
  const token = await AssetToken.deploy("AssetToken", "AST");
  await token.deployed();
  console.log("AssetToken deployed to:", token.address);

  const AssetCustody = await ethers.getContractFactory("AssetCustody");
  const custody = await AssetCustody.deploy(token.address);
  await custody.deployed();
  console.log("AssetCustody deployed to:", custody.address);

  // Transfer token ownership to custody so custody can mint/burn
  const tx = await token.transferOwnership(custody.address);
  await tx.wait();
  console.log("Transferred token ownership to custody:", custody.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
