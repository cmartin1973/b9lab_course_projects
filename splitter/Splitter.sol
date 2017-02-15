pragma solidity ^0.4.2;

contract Splitter {
	address owner;
	address bobAddress;
	address carolAddress;

	function Splitter(address bob, address carol) {
		owner = msg.sender;
		bobAddress = bob;
		carolAddress = carol;
	}

	function getBalance() constant returns (uint) {
		return this.balance;
	}
	
	function getBobAddress() constant returns (address) {
		return bobAddress;
	}
	
	function getCarolAddress() constant returns (address) {
		return carolAddress;
	}
	
	function sendEther() payable returns (bool) {
		if (msg.sender == owner) {
			uint etherToSend = msg.value/2;
			var bobSend = bobAddress.send(etherToSend);
			var carolSend = carolAddress.send(etherToSend);
			return bobSend && carolSend;
		}
		else {
			return this.send(msg.value);
		}
	}

	function killMe() returns (bool) {
        if (msg.sender == owner) {
            suicide(owner);
            return true;
        }
    }

    function() payable {}
}
