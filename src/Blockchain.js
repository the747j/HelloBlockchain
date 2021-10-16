const SHA256  = require('crypto-js/sha256')
const Block  = require('./Block')

class Blockchain {
    constructor (){
        let block= Block.getTheGenesis()
        this.chain = [block];
    }

    addBlock(body){
        const previousBlock = this.chain[this.chain.length-1]
        const block = Block.mine(previousBlock,body)
        this.chain.push(block)
        return block
    }
    
    async validateChain (){
        const self = this;
        const errors = []
        return new Promise(async(resolve, reject)=>{
            self.chain.map(async(block)=>{
                try {
                    const isValid =  await block.validate();
                    if(!isValid)
                        errors.push(new Error(`блок ${block.height} недействителен`))
                }
                catch(err){
                    errors.push(new Error(`${err.message}`))
                }
            })
            resolve(errors)
        })
    }

    async print () {
        const self =  this;
        for(let block of self.chain){
            console.log(block.toString());
        }
    }
}
module.exports = Blockchain;