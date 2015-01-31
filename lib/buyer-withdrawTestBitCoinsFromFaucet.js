var request = require('request');
var bitcoin = require("bitcoinjs-lib");
var helloblock = require('helloblock-js')({
    network: 'testnet'
});

/*
input : {
    address : null,
    valueToWithDraw : null
},
output : {
    transactionId : null
}
*/
// this case allows as to receive few coins to any address generated in testnet
exports.main = function(
    _in,
    main_return_callback) {


    // we are using external service
    // helloblock.io
    // this service sending to us test money owned by them
    request.post('https://testnet.helloblock.io/v1/faucet/withdrawal',
        {
            form : {
                // amount of money we need
                // i choosed this number randomly
                value: _in.valueToWithDraw,
                // our address
                toAddress: _in.address
            }
        },
        function(err, httpResponse, _withDrawResponse){

            _withDrawResponse = JSON.parse(_withDrawResponse);
            var out = {
                transactionId : _withDrawResponse.data.txHash                
            };
            
            // return control flow to the function called us
            //main_return_callback(_withDrawResponse);
            main_return_callback(out);
            //console.log(body);
        });

};
