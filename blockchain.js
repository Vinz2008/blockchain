const Block = require('./block');
const crypto = require('crypto');
const Swarm =  require('@erebos/swarm-node');


class BlockChain {
	constructor() {
		this.firstBlockVar = this.createFirstBlock();
		this.blockchain = [this.firstBlockVar];
		console.log(this.firstBlockVar);
		this.peers = {};
		this.peerId = crypto.randomBytes(32);
		console.log('peerId: ' + this.peerId.toString('hex'));
		this.swarm = new Swarm.SwarmClient({
			bzz: { url: 'http://localhost:8500' },
		});
		  
	};
	createFirstBlock() {
		return new Block(0,Date.now(),{pow: 9,transactions: []}, '0');
	}
	addNewBlock(newBlock) {
        this.blockchain.push(newBlock);
    }
	obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1]; // Get last block on the chain
    }
	checkChainValidity() {
        for(let i = 1; i < this.blockchain.length; i++) { // Iterate through, starting after the genesis block
            const currBlock = this.blockchain[i];
            const prevBlock = this.blockchain[i-1];
            if(currBlock.hash.toString() !== currBlock.createHash().toString()) { 
				console.log("ERROR the actual hash is invalid in index " + i);
				console.log("currBlock.hash : " + currBlock.hash.toString());
				console.log("currBlock.createHash() : " + currBlock.createHash().toString());
				console.log("output : " + (currBlock.hash !== currBlock.createHash()));
                return false;
            }
            if(currBlock.PreviousHash !== prevBlock.hash) {                 
				console.log("ERROR the previous hash is invalid in index " + i);
            	return false;
            }
        }
        return true;
    }
	proofOfWork(lastProof){
		let incrementor = lastProof + 1;
		while (!(incrementor % 9 === 0 && incrementor % lastProof === 0)) {
            incrementor += 1;
        }
		return incrementor;
	}
}


module.exports = BlockChain;