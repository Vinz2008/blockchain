const Block = require('./block');
const crypto = require('crypto');
const Swarm =  require('@erebos/swarm-node');
const firebaseApp = require('firebase/app');
var http = require('http');
const firestore = require('firebase/firestore');
//import { initializeApp } from 'firebase/app';


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
        this.firebaseInit();
        this.isNodeAlreadyInDB();
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
    firebaseInit(){
        this.firebaseConfig = {
            apiKey: "AIzaSyASk7Y85L53MT2eW4CIG6SkWVJJenZ1F40",
            authDomain: "blockchain-111e9.firebaseapp.com",
            projectId: "blockchain-111e9",
            storageBucket: "blockchain-111e9.appspot.com",
            messagingSenderId: "764706009415",
            appId: "1:764706009415:web:19dc1951d10ebe479c5c62"
        };    
        this.app = firebaseApp.initializeApp(this.firebaseConfig);
        this.db = firestore.getFirestore(this.app);
    }

    async getIp(){
        global.ipForReturn = "";
        http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
            resp.on('data', function(ip) {
              console.log("My public IP address is: " + ip);
              ipForReturn = ip;
            });
        });
        return ipForReturn;
    }
    async isNodeAlreadyInDB(){
        var ip = "";
        ip = await this.getIp()
        const q = firestore.query(firestore.collection(this.db, "nodes"), firestore.where("ip", "==", ip));
        const querySnapshot = await firestore.getDocs(q);

        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
        });
    }

}


module.exports = BlockChain;