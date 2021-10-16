const SHA256  = require('crypto-js/sha256')

const GENESIS_DATE  = '2020-08-16'
const GENESIS_HASH  = 'since_the_beginning_of_time'
const DIFFICULTY    = 3
const MINING_RATE   = 2000
const H_W           ='Let There Be Light'

class Block {
    constructor (time, previousHash, hash, nonce,difficulty, body) {
        this.time = time;
        this.previousHash = previousHash;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.body = Buffer.from(JSON.stringify(body).toString('hex'));
    }

    static mine(previousBlock,body) {
        const {hash:previousHash}= previousBlock;
        let {difficulty}= previousBlock;
        let hash;
        let time;
        let nonce = 0;
        do{
            time  = Date.now();
            nonce += 1;
            difficulty = previousBlock.time + MINING_RATE > time ? difficulty+1: difficulty-1;
            hash = SHA256(`${previousHash}-${time}-${body}-${nonce}-${difficulty}`).toString()
        }
        while (hash.substring(0,difficulty)!= "0".repeat(difficulty));

        return new this(time, previousHash, hash, nonce,difficulty, body);
    }

    static getTheGenesis(){
        const time = new Date(GENESIS_DATE).getTime()
        return new Block( time,'NOWHERE', GENESIS_HASH, 0, DIFFICULTY, {data:H_W})
    }

    toString(){
        const {hash, nonce,body,time,difficulty, previousHash} = this;
        return `Hash: ${hash}
            Time: ${time} 
            Nonce: ${nonce}
            Actual difficulty: ${difficulty}
            Body: ${body}
            Previous Block: ${previousHash}
            -------------------------------------------`
    }

    validate (){
        const self = this;
        return new Promise((resolve, reject)=>{
            let currentHash = self.hash;
            let hash = SHA256(`${self.previousHash}-${self.time}-${self.body}-${self.nonce}-${self.difficulty}`).toString();
            if(currentHash !== hash) return reject(false);
            else resolve(true)
        })
    }

    getBlockData(){
        const self =  this;
        return new Promise ((resolve,reject)=>{
            let encodedData = self.body;
            let decodedData = hex2ascii(encodedData)
            let dataObject = JSON.parse(decodedData)
            if(dataObject === H_W)
                reject(new Error(H_W))
            else
            resolve(dataObject)
        })
    }
}

module.exports = Block;