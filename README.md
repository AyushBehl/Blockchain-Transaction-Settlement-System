# Blockchain Transaction and Settlement System

This is a decentralized application (dApp) that allows users to create, track, and settle blockchain transactions using Ethereum smart contracts. The application utilizes **React** for the front-end, **Web3.js** for blockchain interaction, and **Truffle** for smart contract development and deployment.

## Features

- **Create Transactions**: Allows users to create blockchain transactions by specifying the receiver's address and the transaction amount in Ether.
- **Settle Transactions**: Once a transaction is created, users can settle it, indicating successful completion.
- **Blockchain Interaction**: The application interacts with the Ethereum blockchain via **Web3.js** and **MetaMask**.
- **Smart Contract**: The smart contract is deployed on a local Ethereum network (Ganache) for testing and interaction.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Configure MetaMask](#configure-metamask)
  - [Deploy Smart Contract](#deploy-smart-contract)
  - [Run the Application](#run-the-application)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Prerequisites

Before starting the application, ensure the following tools and technologies are installed on your machine:

- **Node.js** (v14.x or later) - [Download Node.js](https://nodejs.org/)
- **Truffle** - Ethereum development framework - [Install Truffle](https://www.trufflesuite.com/truffle)
- **Ganache** - Local Ethereum blockchain - [Download Ganache](https://www.trufflesuite.com/ganache)
- **MetaMask** - Ethereum wallet and browser extension - [Install MetaMask](https://metamask.io/)

## Installation

Follow these steps to get the application running on your local machine.

### Clone the Repository

First, clone the repository to your local machine:

```bash
cd blockchain-transaction-settlement-system

# Install front-end dependencies (React)
cd client
npm install

# Install back-end dependencies (Truffle and Smart Contract)
cd ../
npm install

# Deploy the smart contract to the Ganache network using Truffle:
```bash
truffle migrate --network development

# After setting up the contract, navigate to the client folder and run the React app:
cd client
npm start
