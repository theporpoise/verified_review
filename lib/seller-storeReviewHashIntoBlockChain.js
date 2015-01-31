/*
            method : require('./seller-storeReviewHashIntoBlockChain.js').main,
            in : {
                message : null,
                privateKey : null,
                addressOfUnspents : null
            },
            out : {
                transactionId : null,
                dataStoredInBlockChain : null
            }
*/
var bitcoin = require("bitcoinjs-lib");
var helloblock = require('helloblock-js')({
    network: 'testnet'
});
var blockchain = new (require('cb-helloblock'))('testnet');

// this function make transaction from buyerWallet to address
exports.main = function (
    _input,
    main_return_callback) {

    var output = {
        dataStoredInBlockChain : null,
        transactionId : null
    };

    var fromPrivateKeyToSignWith = bitcoin.ECKey.fromWIF(_input.privateKey);

    blockchain.addresses.unspents(_input.addressOfUnspents, function(err, unspents) {

        console.log(unspents);

        if (err != null) {
            main_return_callback(err);
            return;
        }

        // use the oldest unspent
        var unspent = unspents.pop();

        var transaction = new bitcoin.TransactionBuilder();

        var hashOfTheProductReview = bitcoin.crypto.sha256(_input.message);//.toString('hex')
        var dataToStoreInBlockChain = hashOfTheProductReview.toString('hex').substring(0,8);

        output.dataStoredInBlockChain = dataToStoreInBlockChain;

        var data = new Buffer(dataToStoreInBlockChain, 'hex');
        var dataScript = bitcoin.scripts.nullDataOutput(data);

        transaction.addInput(unspent.txId, unspent.vout);
        transaction.addOutput(dataScript, 1000);
        transaction.sign(0, fromPrivateKeyToSignWith);


        // propogate our just constructed transaction to bitcoin test network
        helloblock.transactions.propagate(transaction.build().toHex(), function(err, res, tx) {

            // if something goest wrong just pass the error to the function call us
            if (err) {
                main_return_callback(err);
                return;
            }

            output.transactionId = tx.txHash;

            main_return_callback(output);

        })

    });

}

