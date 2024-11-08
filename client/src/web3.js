import Web3 from 'web3';

const getWeb3 = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request access to accounts
    return web3;
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  }
  // Non-dapp browsers...
  else {
    alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return null;
  }
};

export default getWeb3;
