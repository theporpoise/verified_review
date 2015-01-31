var bitcoin = require("bitcoinjs-lib");

exports.main = function(_input, main_return_callback) {
    // Seller and buyer wallets are sepearte so we can upgrade seller to HD later
    // for our experiment we are using testnet
    var network = bitcoin.networks.testnet;

    // Need to ensure this is a cryptographically secure RNG
    var wallet = bitcoin.ECKey.makeRandom();

    // generate public address
    var address = wallet.pub.getAddress(network).toBase58Check();

    // make a structure to store all this information
    wallet = {
        // addresses of seller
        addresses : [ address.toString() ], 
        // private Key of buyer in Wallet Import Format
        privateKey : wallet.toWIF(),
        // link to check address of the buyer online
        //linkToCheck : 'https://test.helloblock.io/addresses/' + address
        linkToCheck : 'http://explorer.chain.com/addresses/' + address
    };

    main_return_callback(wallet);
    return;

}
