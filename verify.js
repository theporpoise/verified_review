var bitcoin = require('bitcoinjs-lib');
var Chain = require('chain-node');
var Crypto = require('crypto-js');

var chain = new Chain({
		blockChain : 'testnet3'
	});

chain.getTransaction('120a86f63708492ce585981c8b55e77613f0257ab339462e7836e22d61a2060d', function (err, resp) { // Provided transaction
	var outputFound = false;
	for (var i = 0; i < resp.outputs.length; i++) {
		if (resp.outputs[i].addresses == 'mvNWHsR7ik658tpnUqM6FM7J9o6EPSkczN') { // Sending wallet
			outputFound = true;
		}
	}

	var inputFound = false;
	var inputIndex = null;
	for (var i = 0; i < resp.inputs.length; i++) {
		if (resp.inputs[i].addresses == 'mwjrcrawH11cwwx98AhLge67Z8S2TXyvo3') { // Receiving wallet
			inputFound = true;
			inputIndex = i;
		}
	}

	if (outputFound && inputFound) {
		var scriptSig = resp.inputs[inputIndex].script_signature.split(" ");
		var publicKeyFromScriptSig = bitcoin.ECPubKey.fromHex(scriptSig[1]); // Get public key from scriptsig of transaction input
		var addressFromScriptSig = publicKeyFromScriptSig.getAddress(bitcoin.networks.testnet).toString();

		// This happens on client browser of sender --START--
		var key = bitcoin.ECKey.fromWIF('L3tRGNN8ojfpj6EPS2Rbpd5b6nTKZq2GYhbSn2zNqytdCdLcqYss'); // Sender's private key
		var review = "this is my review text"; // Sender's review
		var signature = bitcoin.Message.sign(key, review, bitcoin.networks.testnet); // Sender signs review
		// This happens on client browser of sender --END--

		var test = bitcoin.Message.verify(addressFromScriptSig, signature, review, bitcoin.networks.testnet); // verify review
		console.log(test); // Does review signature match public key from transaction scriptsig?
	}
});
