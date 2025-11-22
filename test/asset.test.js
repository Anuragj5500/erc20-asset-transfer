const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Asset flow", function () {
  it("register, distribute, transfer, redeem", async function () {
    const [owner, buyer] = await ethers.getSigners();

    const AssetToken = await ethers.getContractFactory("AssetToken");
    const token = await AssetToken.deploy("AssetToken", "AST");
    await token.deployed();

    const AssetCustody = await ethers.getContractFactory("AssetCustody");
    const custody = await AssetCustody.deploy(token.address);
    await custody.deployed();

    // transfer token ownership to custody
    await token.transferOwnership(custody.address);

    // register asset with supply 1000 (18 decimals)
    const supply = ethers.utils.parseUnits("1000", 18);
    const txReg = await custody.registerAsset("ipfs://Qm...", supply);
    await txReg.wait();

    // custody holds tokens
    const balCustody = await token.balanceOf(custody.address);
    expect(balCustody.toString()).to.equal(supply.toString());

    // distribute 100 tokens to buyer
    const amount = ethers.utils.parseUnits("100", 18);
    const txDist = await custody.distribute(amount, buyer.address);
    await txDist.wait();

    const bBuyer = await token.balanceOf(buyer.address);
    expect(bBuyer.toString()).to.equal(amount.toString());

    // buyer transfers tokens back to custody (to redeem)
    await token.connect(buyer).transfer(custody.address, amount);

    // Note: redeemer (buyer) calls redeem; contract burns tokens held by custody
    const txRedeem = await custody.connect(buyer).redeem(1, amount);
    await txRedeem.wait();

    const balAfter = await token.balanceOf(custody.address);
    const expected = supply.sub(amount);
    expect(balAfter.toString()).to.equal(expected.toString());
  });
});
