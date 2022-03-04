const provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/886a05166e87407dba7baaf8d6b3b504");
const web3 = new Web3(provider);
const abi = [{ "inputs": [], "name": "retrieve", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "num", "type": "uint256" }], "name": "store", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
const contractAddress = '0x799A643C8f1ff1aE1b377244D82EBD9640cDed72';

//verifico connessione
web3.eth.net.isListening()
    .then(() => console.log('web3 is connected'))
    .catch(e => console.log('Something went wrong'));

const contract = new web3.eth.Contract(abi, contractAddress);

contract.methods.retrieve().call()
    .then((value) => document.querySelector('#valueBlock').innerText = value);

document.querySelector("#copyIcon").addEventListener('click', () => {
    let copyText = document.querySelector(".showAccount").innerText;
    navigator.clipboard.writeText(copyText);
    console.log("Copied the address: " + copyText);
    document.querySelector("#copied").classList.remove('hidden');
    setTimeout(function () { document.querySelector("#copied").classList.add('hidden') }, 750);
});

document.querySelector("#saveButton").addEventListener('click', async () => {
    let newValueBlock = document.querySelector("#newValueBlock").value;
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    let storeValue = web3.eth.abi.encodeFunctionCall({
        name: 'store',
        type: 'function',
        inputs: [
            {
                type: 'uint256',
                name: 'num'
            }
        ]
    }, [newValueBlock]);
    console.log(storeValue);

    const transactionParameters = {
        from: account,
        to: contractAddress,
        data: storeValue
    };

    const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
    });

})

