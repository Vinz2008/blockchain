const Block = require('./block');
const BlockChain = require('./blockchain');
const getPort = require('get-port');


let blockchain = new BlockChain()
let a = new Block(1,Date.now(),{from: "Joe", to: "Jane"}, PreviousHash = blockchain.firstBlockVar.hashFirstBlock);
let b = new Block(2,Date.now(),{from: "Jane", to: "Joe"}, PreviousHash = a.hash);
blockchain.addNewBlock(a)
blockchain.addNewBlock(b)
console.log(`New block added: ${blockchain.firstBlockVar.toString()}`);
console.log(`New block added: ${a.toString()}`);
console.log(`New block added: ${b.toString()}`);
console.log(blockchain)
console.log(JSON.stringify(blockchain.firstBlockVar.data));
console.log("Blockchain Validity: " + blockchain.checkChainValidity()) 
