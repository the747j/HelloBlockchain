
const Blockchain  = require('./src/Blockchain')
const Block  = require('./src/Block')

async function  run () {
    const blockchain =  new Blockchain()
    blockchain.chain.forEach(async (block)=>console.log(block.toString()))
    for(let b = 0 ; b<10;b++){
        const block = blockchain.addBlock({data:`блок #${b}`})
        console.log(block.toString())
    }
}

run()
