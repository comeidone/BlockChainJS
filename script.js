const provider = new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/886a05166e87407dba7baaf8d6b3b504");
const web3 = new Web3(provider);
const abi = [{ "inputs": [], "name": "retrieve", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "num", "type": "uint256" }], "name": "store", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
const contractAddress = '0x799A643C8f1ff1aE1b377244D82EBD9640cDed72';

//verifico connessione
web3.eth.net.isListening()
    .then(() => console.log('web3 is connected'))
    .catch(e => console.log('Something went wrong'));

const contract = new web3.eth.Contract(abi, contractAddress);

//recupero valore attuale
contract.methods.retrieve().call()
    .then((value) => document.querySelector('#valueBlock').innerText = value);

//avviso di copia dell'indirizzo
document.querySelector("#copyIcon").addEventListener('click', () => {
    let copyText = document.querySelector(".showAccount").innerText;
    navigator.clipboard.writeText(copyText);
    document.querySelector("#copied").classList.remove('hidden');
    setTimeout(function () { document.querySelector("#copied").classList.add('hidden') }, 750);
});

//click su Salva
document.querySelector("#saveButton").addEventListener('click', async () => {
    let newValueBlock = document.querySelector("#newValueBlock").value;
    let oldValueBlock = document.querySelector("#valueBlock").innerText;

    //verifica validità valore inserito
    if(newValueBlock=="" || newValueBlock<0){
        document.querySelector("#saveValueError").classList.remove('hidden');
        document.querySelector('#errorValue').innerText = "Inserisci un valore numerico maggiore o uguale a 0";
        return;
    } else if (newValueBlock==oldValueBlock){
        document.querySelector("#saveValueError").classList.remove('hidden');
        document.querySelector('#errorValue').innerText = "Stai provando ad inserire lo stesso valore. Risparmia i tuoi ETH!";
        return;
    }

    document.querySelector("#saveButton").classList.add('pointer-events-none');
    document.querySelector("#saveButton").classList.remove('bg-blue-500');
    document.querySelector("#saveButton").classList.remove('hover:bg-blue-700');
    document.querySelector("#saveButton").classList.add('bg-blue-200');
    document.querySelector("#saveText").classList.add('hidden');
    document.querySelector("#loadSpinner").classList.remove('hidden');
    document.querySelector("#processingText").classList.remove('hidden');
    document.querySelector("#saveValueSuccess").classList.add('hidden');
    document.querySelector("#saveValueError").classList.add('hidden');

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

    const transactionParameters = {
        from: account,
        to: contractAddress,
        data: storeValue
    };

    const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
    }).then((value) => {
        document.querySelector("#saveButton").classList.remove('pointer-events-none');
        document.querySelector("#saveButton").classList.add('bg-blue-500');
        document.querySelector("#saveButton").classList.add('hover:bg-blue-700');
        document.querySelector("#saveButton").classList.remove('bg-blue-200');
        document.querySelector("#saveText").classList.remove('hidden');
        document.querySelector("#loadSpinner").classList.add('hidden');
        document.querySelector("#processingText").classList.add('hidden');
        document.querySelector("#saveValueSuccess").classList.remove('hidden');
        document.querySelector('#successValue').innerText = value;
    }
    ).catch((error) => {
        document.querySelector("#saveButton").classList.remove('pointer-events-none');
        document.querySelector("#saveButton").classList.add('bg-blue-500');
        document.querySelector("#saveButton").classList.add('hover:bg-blue-700');
        document.querySelector("#saveButton").classList.remove('bg-blue-200');
        document.querySelector("#saveText").classList.remove('hidden');
        document.querySelector("#loadSpinner").classList.add('hidden');
        document.querySelector("#processingText").classList.add('hidden');
        document.querySelector("#saveValueError").classList.remove('hidden');
        document.querySelector('#errorValue').innerText = error.code + " " + error.message;
    });

})

