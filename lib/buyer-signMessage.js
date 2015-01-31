/*
        signMessage : {
            method : require('./buyer-signMessage.js').main,
            input : {
                message : null,
                privateKey : null
            },
            output : {
                signatureDER : null
            }
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



// sign message from with the private key
exports.main = function(
    _input,
    main_return_callback) {


    // convert key from Wallet Import Format to library internal object
    var fromPrivateKeyToSignWith = bitcoin.ECKey.fromWIF(_input.privateKey);

    // get public key of private key of buyer in hex format
    var fromPublicKeyHex = fromPrivateKeyToSignWith.pub.toHex();

    // get the hash of the message we are going to sign
    // this is eqialent to the message
    var hashOfTheProductReview = bitcoin.crypto.sha256(_input.message);

    // get real crypto signature
    // pass - private key
    // and
    // hash of message
    var signature = fromPrivateKeyToSignWith.sign(hashOfTheProductReview);

    // encode signature to DER Distinguished Encoding Rules format
    // DER is used as the most popular encoding format to store X.509 certificates in files.
    var DER = signature.toDER().toString('hex');

    var output = {
        signatureDER : DER
    };

    // return to function who called us signature
    main_return_callback(output);

};

