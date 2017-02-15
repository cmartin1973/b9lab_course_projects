 var aliceAddress;
 var bobAddress;
 var carolAddress;
 
 var funderAddress;
 var remittanceAddress;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

function refreshBalances(showMessage) {
  if (showMessage) setStatus("Refreshing balances...");

  var remittance = Remittance.deployed();
  remittance.getBalance.call().then(function(value) {
    var balance_element = document.getElementById("balanceRemittance");
    balance_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });

  var aliceBalance = web3.fromWei(web3.eth.getBalance(aliceAddress), "ether");
  var aliceBalance_element = document.getElementById("balanceAlice");
  aliceBalance_element.innerHTML = aliceBalance;

  var bobBalance = web3.fromWei(web3.eth.getBalance(bobAddress), "ether");
  var bobBalance_element = document.getElementById("balanceBob");
  bobBalance_element.innerHTML = bobBalance;

  var carolBalance = web3.fromWei(web3.eth.getBalance(carolAddress), "ether");
  var carolBalance_element = document.getElementById("balanceCarol");
  carolBalance_element.innerHTML = carolBalance;

  if (showMessage) setStatus("Balances refreshed.");
}

function setPayer() {
  var payerList = document.getElementById("payerAddress")
  if (payerList.selectedIndex == 0) {
    alert("Please select a valid payer address");
    return;
  }
  var payerAddress = document.getElementById("payerAddress").value;
  setStatus("Initiating transaction... (please wait)");
  console.log("payer address = " + payerAddress);

  var remittance = Remittance.deployed();
  remittance.changeOwner(payerAddress, {from: aliceAddress, gas: 1000000}).then(function(txHash) {
    console.log("Transaction hash = " + txHash);
    switch (payerList.selectedIndex)
    {
        case 1:
            funderAddress = aliceAddress;
            console.log("Alice is payer");
            break;
        case 2:
            funderAddress = bobAddress;
            console.log("Bob is payer");
            break;
        case 3:
            funderAddress =  carolAddress;
            console.log("Carol is payer");
            break;
        deafult:
            funderAddress = aliceAddress;
            break;
    }
    console.log("funderAddress = " + funderAddress);
    setStatus("Payer set");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error setting payer; see log.");
  });
}

function getPayer() {
  var remittance = Remittance.deployed();
  remittance.getPayerAddress.call().then(function(value) {
    funderAddress = value;
    var payer_element = document.getElementById("showPayer");
    payer_element.innerHTML = value;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting payer; see log.");
  });
}

function setPayee() {
  var payeeList = document.getElementById("payeeAddress")
  if (payeeList.selectedIndex == 0) {
    alert("Please select a valid payee address");
    return;
  }
  var payeeAddress = document.getElementById("payeeAddress").value;
  setStatus("Initiating transaction... (please wait)");
  console.log("payee address = " + payeeAddress);
  console.log("funderAddress = " + funderAddress);

  var remittance = Remittance.deployed();
  remittance.setPayee(payeeAddress, {from: funderAddress, gas: 1000000}).then(function(txHash) {
    console.log("Transaction hash = " + txHash);
    switch (payeeList.selectedIndex)
    {
        case 1:
            remittanceAddress = aliceAddress;
            console.log("Alice is payee");
            break;
        case 2:
            remittanceAddress = bobAddress;
            console.log("Bob is payee");
            break;
        case 3:
            remittanceAddress =  carolAddress;
            console.log("Carol is payee");
            break;
        deafult:
            remittanceAddress = aliceAddress;
            break;
    }
    console.log("remittanceAddress = " + remittanceAddress);
    setStatus("Payee set");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error setting payee; see log.");
  });
}

function getPayee() {
  var remittance = Remittance.deployed();
  remittance.getPayeeAddress.call().then(function(value) {
    remittanceAddress = value;
    var payee_element = document.getElementById("showPayee");
    payee_element.innerHTML = value;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting payee; see log.");
  });
}

function setChallenges() {
  var remittance = Remittance.deployed();
  var challenge1 = web3.sha3(document.getElementById("challenge1").value);
  var challenge2 = web3.sha3(document.getElementById("challenge2").value);
  setStatus("Initiating transaction... (please wait)");
  console.log("challenge1 = " + challenge1);
  console.log("challenge2 = " + challenge2);
  console.log("funderAddress = " + funderAddress);

  remittance.setChallenges(challenge1, challenge2, {from: funderAddress, gas: 1000000}).then(function(txHash) {
    console.log("Transaction hash = " + txHash);
    setStatus("Challenges set");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error setting challenges; see log.");
  });  
}

function getChallenge1() {
  var remittance = Remittance.deployed();
  remittance.getChallenge1.call().then(function(value) {
    var chal1_element = document.getElementById("showChallenge1");
    chal1_element.innerHTML = value;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting Challenge 1; see log.");
  });
}

function getChallenge2() {
  var remittance = Remittance.deployed();
  remittance.getChallenge2.call().then(function(value) {
    var chal2_element = document.getElementById("showChallenge2");
    chal2_element.innerHTML = value;
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting Challenge 2; see log.");
  });
}

function fundContract() {
  var remittance = Remittance.deployed();
  var amount = parseInt(document.getElementById("amount").value);
  setStatus("Initiating transaction... (please wait)");
  console.log("amount to be sent = " + amount);
  console.log("funderAddress = " + funderAddress);

  remittance.fundContract({from: funderAddress, value: web3.toWei(amount, "ether"), gas: 1000000}).then(function(txHash) {
    console.log("Transaction hash = " + txHash);
    setStatus("Contract funded");
    refreshBalances(false);
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending ether; see log.");
  });
}

function retrieveFunds() {
  var remittance = Remittance.deployed();
  var challenge1 = web3.sha3(document.getElementById("payeeChallenge1").value);
  var challenge2 = web3.sha3(document.getElementById("payeeChallenge2").value);
  console.log("challenge1 = " + challenge1);
  console.log("challenge2 = " + challenge2);
  console.log("remittanceAddress = " + remittanceAddress);

  remittance.retrieveFunds(challenge1, challenge2, {from: remittanceAddress, gas: 1000000}).then(function(txHash) {
    console.log("Transaction hash = " + txHash);
    setStatus("Remittance funds retrieved");
    refreshBalances(false);
  }).catch(function(e) {
    console.log(e);
    setStatus("Error retrieving funds; see log.");
  });  
}

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    aliceAddress = accs[0];
    bobAddress = accs[1];
    carolAddress = accs[2];

    funderAddress = aliceAddress;

    var payerList = document.getElementById("payerAddress");
    var opt1 = document.createElement('option');
    opt1.value = "";
    opt1.innerHTML = "";
    payerList.appendChild(opt1);
    var opt2 = document.createElement('option');
    opt2.value = aliceAddress.toString();
    opt2.innerHTML = aliceAddress.toString();
    payerList.appendChild(opt2);
    var opt3 = document.createElement('option');
    opt3.value = bobAddress.toString();
    opt3.innerHTML = bobAddress.toString();
    payerList.appendChild(opt3);
    var opt4 = document.createElement('option');
    opt4.value = carolAddress.toString();
    opt4.innerHTML = carolAddress.toString();
    payerList.appendChild(opt4);

    var payeeList = document.getElementById("payeeAddress");
    var opt5 = document.createElement('option');
    opt5.value = "";
    opt5.innerHTML = "";
    payeeList.appendChild(opt5);
    var opt6 = document.createElement('option');
    opt6.value = aliceAddress.toString();
    opt6.innerHTML = aliceAddress.toString();
    payeeList.appendChild(opt6);
    var opt7 = document.createElement('option');
    opt7.value = bobAddress.toString();
    opt7.innerHTML = bobAddress.toString();
    payeeList.appendChild(opt7);
    var opt8 = document.createElement('option');
    opt8.value = carolAddress.toString();
    opt8.innerHTML = carolAddress.toString();
    payeeList.appendChild(opt8);

    refreshBalances(true);
  });
}
