const connectionButton = document.querySelector('#connectionButton')

//verifico se Metamask è stato installato
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    document.querySelector("#accountLink").classList.add("hidden")
} else {
    console.log('Metamask not installed!');
    connectionButton.classList.remove('bg-blue-500');
    connectionButton.classList.remove('hover:bg-blue-700');
    connectionButton.classList.add('bg-red-500');
    connectionButton.classList.add('pointer-events-none');
    connectionButton.innerText = "Installa Metamask";
}

//inizializzo bottone MetaMask e verifico evento click
const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');


ethereumButton.addEventListener('click', () => {
    document.querySelector('#metaMaskNotification').classList.remove('hidden');
    connectionButton.classList.add('pointer-events-none');
    connectionButton.classList.remove('bg-blue-500');
    connectionButton.classList.add('bg-blue-200');
    connectionButton.innerText = "Accedi dall'estensione di MetaMask";
    getAccount();
});

//recupero l'account in modo asincrono
async function getAccount() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        .catch((err) => {
            if (err.code == -32002) {
                console.log("guarda su!");
                return null;
            } else {
                resetConnectionForm();
            }
        });
    const account = accounts[0];
    connectionButton.classList.remove('bg-blue-200');
    connectionButton.classList.remove('hover:bg-blue-700');
    connectionButton.classList.add('bg-green-500');
    connectionButton.classList.add('pointer-events-none');
    connectionButton.innerText = "Connesso";
    document.querySelector("#accountAddress").innerText = "Account: ";
    showAccount.innerHTML = account;
    document.querySelector("#infoCard").classList.remove('hidden');
    document.querySelector("#valueApp").classList.remove('hidden');
    document.querySelector("#copyIcon").classList.remove('hidden');
    document.querySelector('#metaMaskNotification').classList.add('hidden');

}

//verifico i cambiamenti di stato dell'account
if (typeof window.ethereum !== 'undefined') {
    ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length != 0) {
            showAccount.innerHTML = accounts;
        } else {
            resetConnectionForm();
        }
    });
}

//resetto i valori in pagina
function resetConnectionForm() {
    connectionButton.classList.add('bg-blue-500');
    connectionButton.classList.add('hover:bg-blue-700');
    connectionButton.classList.remove('bg-green-500');
    connectionButton.classList.remove('pointer-events-none');
    showAccount.innerHTML = "";
    document.querySelector("#copyIcon").classList.add('hidden');
    connectionButton.innerText = "Connetti";
    document.querySelector("#accountAddress").innerText = "Nessun account connesso";
    document.querySelector("#infoCard").classList.add('hidden');
    document.querySelector("#valueApp").classList.add('hidden');
    document.querySelector('#metaMaskNotification').classList.add('hidden');
    document.querySelector("#saveValueSuccess").classList.add('hidden');
    document.querySelector("#saveValueError").classList.add('hidden');
    document.querySelector('#errorValue').innerText = "";
    document.querySelector('#successValue').innerText = "";
    document.querySelector('#newValueBlock').value = 0;
}
