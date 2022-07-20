var clc = require("cli-color");
const crypto = require('crypto');
const SHA256 = require('crypto-js/sha256');
const Swarm = require('discovery-swarm');
const defaults = require('dat-swarm-defaults');
const getPort = require('get-port');

const channel = 'blockchain';


global.isBlockFirst = false;
class Block{
	constructor(index,/*current_time,*/ data, PreviousHash=" "){
		console.log("NEW BLOCK");
		this.index = index;
		console.log("index: ", this.index);
		this.current_time = Date.now();
		console.log("time: ", this.current_time);
		this.data = data;
		console.log("data: ", this.data);
		this.PreviousHash = PreviousHash;
		console.log("previous hash: ", this.PreviousHash);
		this.hash = this.createHash();
		console.log("hash: ", this.hash);
		if (isBlockFirst == true){
		global.hashFirstBlock = this.hash
		isBlockFirst = false;
		}
	}
	createHash() {
		let hashCreated = SHA256(this.data + this.index + this.PreviousHash + this.current_time + JSON.stringify(this.data));
		return hashCreated;
	}
}

class BlockChain {
	constructor() {
		let firstBlockVar = this.createFirstBlock()
		this.blockchain = [firstBlockVar]
		console.log(firstBlockVar)
		this.peers = {};
		this.peerId = crypto.randomBytes(32);
		console.log('peerId: ' + this.peerId.toString('hex'));
		this.config = defaults({
    			id: this.peerId,
		});
		const swarm = Swarm(this.config);
	};
	async connectBlockchain(){
		
	}
	createFirstBlock() {
		isBlockFirst = true
		return new Block(0,"First Block", "0");
	}
	addNewBlock(newBlock) {
        this.blockchain.push(newBlock)
    	}
	obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1] // Get last block on the chain
    	}
	checkChainValidity() {
        for(let i = 1; i < this.blockchain.length; i++) { // Iterate through, starting after the genesis block
            const currBlock = this.blockchain[i]
            const prevBlock = this.blockchain[i -1]
            if(currBlock.hash !== currBlock.createHash()) { 
		console.log("ERROR the actual hash is invalid in index " + i)
                return false
            }
            if(currBlock.prevHash !== prevBlock.hash) {                 
		console.log("ERROR the previous hash is invalid in index " + i)
              return false
            }
        }
        return true
    }

}

let blockchain = new BlockChain()
let a = new Block(1,{from: "Joe", to: "Jane"}, PreviousHash = hashFirstBlock)
let b = new Block(2,{from: "Jane", to: "Joe"}, PreviousHash = a.hash)
blockchain.addNewBlock(a)
blockchain.addNewBlock(b)
console.log(blockchain)
console.log("Blockchain Validity: " + blockchain.checkChainValidity()) 
