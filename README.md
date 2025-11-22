#  Asset Transfer Platform — ERC20 Token + Hardhat + React

A complete decentralized asset transfer platform built using **Solidity**, **Hardhat**, **Ethers.js v6**, and a modern **Neon UI React frontend**.
This project demonstrates how real-world assets (property, shares, items) can be represented as **ERC-20 tokens** and transferred securely via blockchain.

---

##  Features

## Smart Contracts (Hardhat)

* ERC-20 Asset Token (`AssetToken.sol`)
* Custody Contract (`AssetCustody.sol`)
* Scripts for deployment, token transfer, and balance checking
* Hardhat local blockchain powered by EVM
* Detailed testing setup

###  Frontend (React + Ethers.js v6)

* Neon/Glassmorphism UI
* Connect MetaMask wallet
* View:

  * Wallet address
  * Network
  * Token balance
  * Token decimals
* Transfer ERC-20 tokens from wallet to any address
* Clean toast notifications
* Auto-refresh on network or account change

###  Tools & Stack

| Layer      | Technology                      |
| ---------- | ------------------------------- |
| Blockchain | Hardhat, Solidity               |
| Frontend   | React, Ethers.js v6             |
| Wallet     | MetaMask                        |
| Network    | Localhost 8545 (Chain ID 31337) |

---

##  Project Structure

```
erc20-asset-transfer/
│── contracts/
│   ├── AssetToken.sol
│   └── AssetCustody.sol
│
│── scripts/
│   ├── deploy.js
│   ├── transferTokens.js
│   └── checkBalance.js
│
│── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── abis/
│   │   └── index.js
│   └── public/
│
│── hardhat.config.js
│── package.json
│── README.md
└── ...
```

---

## Installation & Setup

### 1️ Install dependencies

**Root folder:**

```sh
npm install
```
**Frontend folder:**
```sh
cd frontend
npm install
```
---

## Running the Project

### Start the Hardhat Local Blockchain

```sh
npx hardhat node
```
This runs a local network on:
* RPC: **[http://127.0.0.1:8545/](http://127.0.0.1:8545/)**
* Chain ID: **31337**
* 20 accounts with private keys
---
###  Deploy Smart Contracts
Open a **new terminal** (leave node running):
```sh
npx hardhat run scripts/deploy.js --network localhost
```
You will get deployed contract addresses:
```
AssetToken deployed to: 0x...
AssetCustody deployed to: 0x...
```
###  Add Token Address to Frontend
Open:
```
frontend/src/App.js
```
Update:
```js
const TOKEN_ADDR = "PASTE_YOUR_TOKEN_ADDRESS_HERE";
```

###  Start the React Frontend
```sh
cd frontend
npm start
```
Open in browser:

 [http://localhost:3000/](http://localhost:3000/)

---

##  Connecting MetaMask to Hardhat

### Step 1: Add Hardhat Local Network

MetaMask → Settings → Networks → Add Network Manually

| Field           | Value                                            |
| --------------- | ------------------------------------------------ |
| Network Name    | Hardhat Localhost                                |
| RPC URL         | [http://127.0.0.1:8545/](http://127.0.0.1:8545/) |
| Chain ID        | **31337**                                        |
| Currency Symbol | ETH                                              |

---

### Step 2: Import Hardhat Accounts into MetaMask

Hardhat shows accounts like:

```
Account #0: 0xf39F...
Private Key: 0xabc123...
```

In MetaMask:

* Click Profile Icon → **Import Account**
* Paste private key
* Done ✔

This wallet will have **10,000 ETH** (test ETH).

---

### Step 3: Add Your ERC-20 Token to MetaMask

MetaMask → Assets → Add Token → Custom Token

Paste your deployed token address:

```
0xYourTokenAddressHere
```

Click **Add Token**

---

##  How to Use the App

1. **Connect Wallet**
2. View your:

   * Address
   * Network
   * Token balance
3. Enter:

   * Receiver address
   * Amount
4. Click **Send Tokens**
5. Confirm the MetaMask transaction
6. Success toast will appear ✔

---

## ✔ Helpful Hardhat Commands

```sh
npx hardhat help
npx hardhat test
npx hardhat node
REPORT_GAS=true npx hardhat test
npx hardhat run scripts/deploy.js --network localhost
```

---

##  Purpose of This Project

This project showcases:

* How ERC-20 tokens can represent real-world assets
* How to build a full Web3 DApp with React + Ethers v6
* How to connect smart contracts to a modern UI
* Secure asset transfer using blockchain

Perfect for learning, teaching, or showcasing Web3 development.
