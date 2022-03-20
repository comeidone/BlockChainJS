const providerMOW = new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/33c3766edddb4fad9108f5c768cc5266");
const web3MOW = new Web3(providerMOW);
const abiMOW = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerSet","type":"event"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"readMessage","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_message","type":"string"},{"internalType":"string","name":"_author","type":"string"}],"name":"writeMessage","outputs":[],"stateMutability":"payable","type":"function"}];
const contractAddressMOW = '0xd50b2bf9E69BC6Fba69C4697619f77b2279eB101';

//verifico connessione
web3.eth.net.isListening()
    .then(() => console.log('MessageOnTheWall is connected'))
    .catch(e => console.log('Something went wrong'));

const contractMOW = new web3.eth.Contract(abiMOW, contractAddressMOW);

//recupero valore attuale
contractMOW.methods.readMessage().call()
    .then((value) => {
        document.querySelector("#textMessage").innerText=value[0];
        document.querySelector("#authorMessage").innerText=value[1];
        document.querySelector("#addressMessage").innerText=value[2];
        console.log(value[3]);
        document.querySelector("#timeMessage").innerText=new Date(value[3]*1000).toLocaleDateString("it-IT") +" "+new Date(value[3]*1000).toLocaleTimeString("it-IT");
    });

/*
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
*/
