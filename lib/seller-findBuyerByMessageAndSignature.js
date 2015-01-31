/*
            method : require('./seller-findBuyerByMessageAndSignature.js').main,
            in : {
                message : null,
                signatureDER : null,
                incomeTransactions: null
            },
            out : {
                verificationResult: null,
                buyerTransaction: null
            }
*/
var BigInteger = require('bigi');
var bitcoin = require("bitcoinjs-lib");
var helloblock = require('helloblock-js')({
    network: 'testnet'
});
var ecurve = require('ecurve');
var curve = ecurve.getCurveByName('secp256k1');

//var mongojs = require('mongojs');
//var db = mongojs('127.0.0.1/andy');
//var mongoReviewCollection = db.collection('review');


// here we checking signature with the key extracted from transaction
exports.main = function(
    _input,
    main_return_callback) {

    var buffer = new Buffer(_input.signatureDER, 'hex');
    var signature = bitcoin.ECSignature.fromDER(buffer);

    var output = {
        verificationResult : false
    }

    // For each input transaction try to verify is the oublic key matches the signature
    for (var iTransaction = 0; iTransaction < _input.incomeTransactions.length; iTransaction++) {

        var hashOfSignerMessage = bitcoin.crypto.sha256(_input.message);

        // extract public sender key from the transaction
        var publicKeyThatSignTransaction = bitcoin.ECPubKey.fromHex(_input.incomeTransactions[iTransaction].buyerPublicKey);

        // verify message with the public key extracted from transaction
        var verificationResult = publicKeyThatSignTransaction.verify(hashOfSignerMessage, signature);

        if (verificationResult == true) {
            output.verificationResult = true;
            output.buyerTransaction = _input.incomeTransactions[iTransaction];
            break;
        }

    }

    main_return_callback(output);

};
