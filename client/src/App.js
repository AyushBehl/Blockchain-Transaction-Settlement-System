import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Card, CardContent, Box } from '@mui/material';
import getWeb3 from './web3';
import SettlementContract from './contracts/Settlement.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        setWeb3(web3);
        
        // Fetch initial accounts
        let accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
  
        // Listen for account changes in MetaMask
        window.ethereum.on('accountsChanged', async (newAccounts) => {
          console.log('Accounts changed:', newAccounts);
          setAccounts(newAccounts);
        });
  
        const networkId = await web3.eth.net.getId();
        const networkIdStr = networkId.toString();
        const deployedNetwork = SettlementContract.networks[networkIdStr];
        
        if (deployedNetwork) {
          const instance = new web3.eth.Contract(
            SettlementContract.abi,
            deployedNetwork.address
          );
          setContract(instance);
        } else {
          console.error('Contract not deployed on the current network');
        }
      } catch (error) {
        console.error('Failed to load web3, accounts, or contract:', error);
      }
    };
  
    init();
  
    // Clean up the event listener
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        const newAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccounts(newAccounts);
      } catch (error) {
        console.error('User denied account access:', error);
      }
    } else {
      alert('MetaMask is not installed!');
    }
  };

  const createTransaction = async () => {
    if (contract && receiver && amount) {
      try {
        // Convert the amount from ETH to Wei for proper transaction value
        const amountInWei = web3.utils.toWei(amount, 'ether');
        
        // Check if the sender has enough Ether
        const senderBalance = await web3.eth.getBalance(accounts[0]);
        if (parseFloat(senderBalance) < parseFloat(amountInWei)) {
          alert('Insufficient funds to make this transaction');
          return;
        }
  
        // Send the transaction
        await contract.methods.createTransaction(receiver, amountInWei)
          .send({ from: accounts[0] });
        
        let send = web3.eth.sendTransaction({ from: accounts[0], to: receiver, value: amount });
        console.log(send);
  
        // Update the transactions state after successful transaction
        const newTransaction = {
          id: Date.now(), // Using timestamp as a unique ID
          receiver,
          amount: amount,
          status: 'Sent'
        };
        setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  
        console.log('Transaction created and state updated');
      } catch (error) {
        console.error('Error creating transaction:', error);
        alert('Transaction failed. Please check the console for errors.');
      }
    } else {
      alert('Please provide receiver address and amount.');
    }
  };
  

  const settleTransaction = async (id) => {
    if (contract) {
      try {
        await contract.methods.settleTransaction(id).send({ from: accounts[0] });
        console.log('Transaction settled');
      } catch (error) {
        console.error('Error settling transaction:', error);
      }
    }
  };

  return (
    <Container maxWidth="md" style={{ backgroundColor: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Blockchain Transaction and Settlement System
      </Typography>
      
      <h5>Account Connected: {accounts}</h5>
      
      <Card style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Create Transaction
        </Typography>
        <TextField
          label="Receiver Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <TextField
          label="Amount in ETH"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={createTransaction}
          style={{ marginTop: '1rem' }}
        >
          Send Transaction
        </Button>
      </Card>

      <Typography variant="h5" gutterBottom>
        Transactions
      </Typography>
      <Box container spacing={2}>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <Box item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">Transaction ID: {transaction.id}</Typography>
                  <Typography variant="body1">Receiver: {transaction.receiver}</Typography>
                  <Typography variant="body1">Amount: {transaction.amount} ETH</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => settleTransaction(transaction.id)}
                    style={{ marginTop: '1rem' }}
                  >
                    Settle Transaction
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" align="center" style={{ width: '100%' }}>
            No transactions to display.
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default App;
