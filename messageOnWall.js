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


//click su Salva
document.querySelector("#saveMessageButton").addEventListener('click', async () => {
    let newMessageText = document.querySelector("#newMessageBlock").value;
    let newAuthorText = document.querySelector("#newAuthorBlock").value;

    //verifica validità valore inserito
    if(newMessageText==""){
        document.querySelector("#saveMessageError").classList.remove('hidden');
        document.querySelector('#errorMessage').innerText = "Inserisci un messaggio valido";
        return;
    }
    if(newAuthorText==""){
        newAuthorText="Anonymous";
    }

    document.querySelector("#saveMessageButton").classList.add('pointer-events-none');
    document.querySelector("#saveMessageButton").classList.remove('bg-blue-500');
    document.querySelector("#saveMessageButton").classList.remove('hover:bg-blue-700');
    document.querySelector("#saveMessageButton").classList.add('bg-blue-200');
    document.querySelector("#saveMessageText").classList.add('hidden');
    document.querySelector("#messageLoadSpinner").classList.remove('hidden');
    document.querySelector("#messageProcessingText").classList.remove('hidden');
    document.querySelector("#saveMessageSuccess").classList.add('hidden');
    document.querySelector("#saveMessageError").classList.add('hidden');

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    let writeMessage = web3.eth.abi.encodeFunctionCall({
        type: "function",
        name: "writeMessage",
        inputs: [{
                name: "_message",
                type: "string"
            }, {
                name: "_author",
                type: "string"
            }
        ]
    }, [newMessageText, newAuthorText]);

    const transactionParameters = {
        from: account,
        to: contractAddressMOW,
        value: web3.utils.toHex(web3.utils.toWei('0.00001','ether')),
        data: writeMessage
    };

    const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
    }).then((value) => {
        document.querySelector("#saveMessageButton").classList.remove('pointer-events-none');
        document.querySelector("#saveMessageButton").classList.add('bg-blue-500');
        document.querySelector("#saveMessageButton").classList.add('hover:bg-blue-700');
        document.querySelector("#saveMessageButton").classList.remove('bg-blue-200');
        document.querySelector("#saveMessageText").classList.remove('hidden');
        document.querySelector("#messageLoadSpinner").classList.add('hidden');
        document.querySelector("#messageProcessingText").classList.add('hidden');
        document.querySelector("#saveMessageSuccess").classList.remove('hidden');
        document.querySelector('#successMessage').innerText = value;
    }
    ).catch((error) => {
        document.querySelector("#saveMessageButton").classList.remove('pointer-events-none');
        document.querySelector("#saveMessageButton").classList.add('bg-blue-500');
        document.querySelector("#saveMessageButton").classList.add('hover:bg-blue-700');
        document.querySelector("#saveMessageButton").classList.remove('bg-blue-200');
        document.querySelector("#saveMessageText").classList.remove('hidden');
        document.querySelector("#messageLoadSpinner").classList.add('hidden');
        document.querySelector("#messageProcessingText").classList.add('hidden');
        document.querySelector("#saveMessageError").classList.remove('hidden');
        document.querySelector('#errorMessage').innerText = error.code + " " + error.message;
    });

})

