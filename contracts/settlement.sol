// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Settlement {
    address public owner;
    uint public transactionCount = 0;

    struct Transaction {
        uint id;
        address sender;
        address receiver;
        uint amount;
        bool settled;
    }

    mapping(uint => Transaction) public transactions;

    event TransactionCreated(
        uint id,
        address indexed sender,
        address indexed receiver,
        uint amount,
        bool settled
    );

    event TransactionSettled(
        uint id,
        bool settled
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createTransaction(address _receiver, uint _amount) public {
        transactionCount++;
        transactions[transactionCount] = Transaction(transactionCount, msg.sender, _receiver, _amount, false);
        emit TransactionCreated(transactionCount, msg.sender, _receiver, _amount, false);
    }

    function settleTransaction(uint _id) public onlyOwner {
        Transaction storage txn = transactions[_id];
        require(!txn.settled, "Transaction already settled");
        // Here you can add logic to transfer funds, interact with ERC20 tokens, etc.
        txn.settled = true;
        emit TransactionSettled(_id, true);
    }

    function getTransaction(uint _id) public view returns (Transaction memory) {
        return transactions[_id];
    }
}
