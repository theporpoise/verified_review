/*
        recognizeIncomeTransaction : {
            method : require('./seller-recognizeIncomeTransaction.js').main,
            in : {
                transactionId : null
            },
            out : {
                transactionId : null,
                buyerPublicKey : null
            }
        },
*/
// here we just include libraries we need
// you could install them with npm install libraryName
// you also could find every library in ./node_modules folder
var bitcoin = require("bitcoinjs-lib");
var helloblock = require('helloblock-js')({
    network: 'testnet'
});


// here we are checking if transaction were send from specific public key
exports.main = function (
    _input,
    main_return_callback) {

    // ask the network to provide us transasction
    // important notice - this is not bitcoin network call this is external service call
    // so in production we must not do this, because thirdthpary could fake the data
    // this is just for educational purpose
    helloblock.transactions.get(_input.transactionId,
        function (err, resp, transaction) {

            // if something goes wrong just return error to the function that called us
            if (err) {
                main_return_callback(err);
                return;
            }

            // here we already have transaction in raw format
            // transaction - variable

            // get first input from the transaction
            // and extract from it scriptSig
            // in production there could be more than 1 input
            var scriptSig = transaction.inputs[0].scriptSig;

            // convert scriptSig from hex format to internal object of the library
            var script = bitcoin.Script.fromHex(scriptSig);

            // structure of srcipt contains 2 object
            // [0] = unlocking script ??
            // [1] = publicKey of locker
            var publicKeyThatSignTransaction = bitcoin.ECPubKey.fromBuffer(script.chunks[1]);

            var output = {
                transactionId : _input.transactionId,
                buyerPublicKey : publicKeyThatSignTransaction.toHex()
            }

            // return control flow to the function who called us
            // with result of comparing key extracted from script and key passed as argument
            main_return_callback(output);


        });
}




