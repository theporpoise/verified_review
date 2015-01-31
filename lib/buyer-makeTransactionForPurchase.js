/*
            method : require('./buyer-makeTransactionForPurchase.js').main,
            input : {
                buyerPrivateKey : null,
                buyerAddressOfUnspents : null,
                sellerAddress : null,
                costOfPurchase : null,
                transactionFee : null
            },
            output : {
                transactionId : null
            }

        }
*/
// here we just include libraries we need
var bitcoin = require("bitcoinjs-lib");
var helloblock = require('helloblock-js')({
    network: 'testnet'
});
var blockchain = new (require('cb-helloblock'))('testnet');

// this function make transaction from buyerWallet to address
exports.main = function (
    _input,
    // function to return control flow after all our async work will be done
    main_return_callback) {

    // Get private key from WIF
    var fromPrivateKeyToSignWith = bitcoin.ECKey.fromWIF(_input.buyerPrivateKey);

    // address of buyer from what we are going to send money
    var fromAddress = _input.buyerAddressOfUnspents;

    // address of seller to we are going to send money
    var toAddress = _input.sellerAddress;

    // fee we are suggesting to miners for our transaction
    var txFee = _input.transactionFee;

    // amount of money we are going to send to seller
    var txTargetValue = _input.costOfPurchase; // satoshi

    // we are sending to the seller some coins
    // that are already presented on the network and locked with buyer private key
    // this money is market as Unspended for the particular address
    // we just need to find them
    helloblock.addresses.getUnspents(fromAddress, function(err, resp, unspents) {

        // if something goest wrong just pass the error to the function call us
        if (err != null) {
            main_return_callback(err);
            return;
        }

        //console.log(unspents);

        // we need to build new transaction
        // just will use TransactionBuilder for that
        var transaction = new bitcoin.TransactionBuilder();

        // at first we need to find all money (value) we have unspent for this address
        var totalUnspentsValue = 0;
        unspents.forEach(function(unspent) {

            // add all such unspends as input to our transaction
            transaction.addInput(unspent.txHash, unspent.index)

            // calculate total summ of all of this money
            totalUnspentsValue += unspent.value
        });

        // first add output of money to be send (locked) for the address of seller
        transaction.addOutput(toAddress, txTargetValue);

        // second we need to return change to ourselves
        var txChangeValue = totalUnspentsValue - txTargetValue - txFee;
        transaction.addOutput(fromAddress, txChangeValue);

        // sign the transaction with our private key
        transaction.sign(0, fromPrivateKeyToSignWith);

        // propogate our just constructed transaction to bitcoin test network
        helloblock.transactions.propagate(transaction.build().toHex(), function(err, res, transaction) {

            // if something goest wrong just pass the error to the function call us
            if (err) {
                main_return_callback(err);
                return;
            }

            var output = {
                transactionId : transaction.txHash
            }

            main_return_callback(output);
            return;


        })

    });

}

