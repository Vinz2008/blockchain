const SHA256 = require('crypto-js/sha256');

class Block{
	constructor(index,current_time, data, PreviousHash=" "){
		console.log("NEW BLOCK");
		this.index = index;
		console.log("index: ", this.index);
		this.current_time = current_time;
		console.log("time: ", this.current_time);
		this.data = data;
		console.log("data: ", this.data);
		this.PreviousHash = PreviousHash;
		console.log("previous hash: ", this.PreviousHash);
		this.hash = this.createHash();
		console.log("hash: ", this.hash);
		if (index == 0){
		this.hashFirstBlock = this.hash;
		this.isBlockFirst = true;
		} else {
        this.isBlockFirst = false;
        }
	}
	createHash() {
		let hashCreated = SHA256(this.data + this.index + this.PreviousHash + this.current_time + JSON.stringify(this.data));
		return hashCreated;
	}
	toString(){
        return `Block -
		Index :  ${this.index}
        Timestamp : ${this.current_time}
        Previous Hash : ${this.PreviousHash}
        Hash      : ${this.hash}
        Data      : ${JSON.stringify(this.data)}`;
    }
}



module.exports = Block;