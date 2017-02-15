pragma solidity ^0.4.2;

contract Remittance {
	address controller;
	address owner;
	address payee;
	bytes32 challenge1;
	bytes32 challenge2;

	modifier checkOwner () {
        if (msg.sender != owner) throw;
        _;
    }
	function Remittance() {
		controller = msg.sender;
		owner = msg.sender;
	}

	function setPayee(address toBePaid) returns (bool) {
		checkOwner()
		payee = toBePaid;
		return true;
	}

	function setChallenges(bytes32 chal1, bytes32 chal2) returns (bool) {
		checkOwner()
		challenge1 = chal1;
		challenge2 = chal2;
		return true;
	}

	function fundContract() payable returns (bool) {
		checkOwner()
		return this.send(msg.value);
	}

	function retrieveFunds(bytes32 chal1, bytes32 chal2) payable returns (bool) {
		if (msg.sender != payee) throw;
		if (challenge1 == "0x0" || challenge2 == "0x0") throw;
		if (chal1 != challenge1 || chal2 != challenge2) throw;

		if (payee.send(this.balance)) {
			challenge1 = 0x0;
			challenge2 = 0x0;
			payee = 0x0;
			return true;
		}
		return false;
	}

	function changeOwner(address newOwner) returns (bool) {
		if (msg.sender != controller) throw;
		if (owner.send(this.balance)) {
			owner = newOwner;
			return true;
		}
		return false;
	}	

	function getPayerAddress() constant returns (address) {
		return owner;
	}

	function getPayeeAddress() constant returns (address) {
		return payee;
	}

	function getChallenge1() constant returns (bytes32) {
		return challenge1;
	}

	function getChallenge2() constant returns (bytes32) {
		return challenge2;
	}

	function getBalance() constant returns (uint) {
		return this.balance;
	}

	function() payable {}
}
