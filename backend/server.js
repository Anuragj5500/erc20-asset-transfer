const express = require('express');
const ethers = require('ethers');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Load ABI
// Adjust the path if necessary. Since we are in 'backend/', we go up one level to 'artifacts'
const AssetCustodyArtifact = require('../artifacts/contracts/AssetCustody.sol/AssetCustody.json');

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const custodyAddress = process.env.CUSTODY_ADDRESS;
const custodyContract = new ethers.Contract(custodyAddress, AssetCustodyArtifact.abi, wallet);

app.post('/api/transfer', async (req, res) => {
    const { to, amount, assetId } = req.body;

    if (!to || !amount) {
        return res.status(400).json({ error: 'Missing "to" or "amount"' });
    }

    try {
        console.log(`Initiating transfer of ${amount} tokens to ${to}...`);
        
        // The 'distribute' function in AssetCustody.sol takes (amount, to)
        // function distribute(uint256 amount, address to) external onlyOwner
        const tx = await custodyContract.distribute(amount, to);
        
        console.log(`Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`Transaction mined: ${receipt.transactionHash}`);

        res.json({ 
            success: true, 
            txHash: receipt.transactionHash,
            to: to,
            amount: amount
        });
    } catch (error) {
        console.error('Transfer failed:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
