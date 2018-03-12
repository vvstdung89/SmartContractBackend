const TruffleContract = require('truffle-contract')
const Web3 = require('web3')
const program = require('commander');
const fs = require("fs")
program
.version('0.1.0')
.option('-h, --host <host>', 'Network host')
.option('-p, --port <port>', 'Network port')
.option('-c, --contract <contract>', 'Contract name')
.parse(process.argv);

const port = program.port || 7545
const host = program.host || "http://127.0.0.1"
const rpc_server = host + ":" + port
var contractName = program.contract

if (!contractName) return console.error('Contract name should be provided ( -c name )')

if (!contractName.endsWith(".json")) {
    contractName += ".json"
}

console.log('Print log of contract ' + contractName)
console.log('RPC Server :  ' + rpc_server)


async function start(){
    try {
        const contractData = JSON.parse(fs.readFileSync(`../contracts/${contractName}`).toString())
        var provider = new Web3.providers.HttpProvider(rpc_server)
        var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server))
        const accounts = web3.eth.accounts

        var Contract = TruffleContract(contractData)
        Contract.setProvider(provider);
        var instance = await Contract.deployed();
        
        instance.allEvents({fromBlock:0}, function(err, event){
            console.log(event)
        })

    } catch(err){
        console.log(err)
    }
}

start()





