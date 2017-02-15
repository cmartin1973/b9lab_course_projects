 var aliceAddress;
 var bobAddress;
 var carolAddress;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshBalances(showMessage) {
  if (showMessage) setStatus("Refreshing balances...");

  var splitter = Splitter.deployed();

  splitter.getBalance.call().then(function(value) {
    var balance_element = document.getElementById("balanceSplitter");
    balance_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting balance; see log.");
  });

  // splitter.getBobAddress.call().then(function(value) {
  //   var bob_element = document.getElementById("addressBob");
  //   bob_element.innerHTML = value;
  // }).catch(function(e) {
  //   console.log(e);
  //   setStatus("Error getting Bob balance; see log.");
  // });

  // splitter.getCarolAddress.call().then(function(value) {
  //   var carol_element = document.getElementById("addressCarol");
  //   carol_element.innerHTML = value;
  // }).catch(function(e) {
  //   console.log(e);
  //   setStatus("Error getting Carol balance; see log.");
  // });

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
};

function sendEther(fromWhom) {
  var splitter = Splitter.deployed();
  
  var amount = parseInt(document.getElementById("amount" + fromWhom).value);
  var payer;
  switch (fromWhom)
  {
    case "Alice":
      payer = aliceAddress;
      break;
    case "Bob":
      payer = bobAddress;
      break;
    case "Carol":
      payer = carolAddress;
      break;
  }

  setStatus("Initiating transaction... (please wait)");

  console.log("amount to be sent = " + amount);
  console.log("payer address = " + payer);

  splitter.sendEther({from: payer, value: web3.toWei(amount, "ether"), gas: 1000000 }).then(function(didItWork) {
    console.log("Did it work = " + didItWork);
    setStatus("Transaction complete!");
    refreshBalances(false);
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending coin; see log.");
  });
};

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

    refreshBalances(true);
  });
}
