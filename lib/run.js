var async = require('async');
var api = require('./api.js').api;

async.waterfall(
    [
        function buyer_createWallet(finish_task_callback) {

            var input = null;

            api.buyer.createWallet.method(input,
                function (_output) {

                    api.sessionStorage.buyer.wallet = _output;

                    console.log('##===============================================================================================');
                    console.log('##.Task 1 buyer.createWallet => completed (creating new wallets)  ===============================');
                    console.log('##===============================================================================================');
                    console.log('=> input =>');
                    console.log(JSON.stringify(input, '', 4));
                    console.log('=> output =>');
                    console.log(JSON.stringify(_output, '', 4));
                    console.log('=> session storage =>');
                    console.log(JSON.stringify(api.sessionStorage, '', 4));

                    finish_task_callback(null);
                    return;

                });

        },
        function seller_createWallet(finish_task_callback) {

            var input = null;

            api.seller.createWallet.method(input,
                function (_output) {

                    api.sessionStorage.seller.wallet = _output;


                    console.log('##================================================================================================');
                    console.log('##.Task 2 seller.createWallet => completed (creating new wallets)  ===============================');
                    console.log('##================================================================================================');
                    console.log('=> input =>');
                    console.log(JSON.stringify(input, '', 4));
                    console.log('=> output =>');
                    console.log(JSON.stringify(_output, '', 4));
                    console.log('=> session storage =>');
                    console.log(JSON.stringify(api.sessionStorage, '', 4));

                    finish_task_callback(null);
                    return;

                });

        },
        function buyer_withdrawFromFaucet(finish_task_callback) {

            var volumeToWithDraw = 140000;

            var input = {
                address : api.sessionStorage.buyer.wallet.addresses[0],
                valueToWithDraw : volumeToWithDraw
            }

            api.buyer.withdrawTestBitCoinsFromFaucet.method(input,
                function (_output) {

                    api.sessionStorage.buyer.faucetWithdrawal  = {
                        volume : volumeToWithDraw,
                        transactionId : _output.transactionId,
                        //linkToCheck : 'https://test.helloblock.io/transactions/' + _output.transactionId
                        linkToCheck : 'http://explorer.chain.com/transactions/' + _output.transactionId                        
                        
                    };

                    console.log('##================================================================================================');
                    console.log('##.Task 3 buyer.withdrawTestBitCoinsFromFaucet (withdraw money from faucet) ======================');
                    console.log('##================================================================================================');
                    console.log('=> input =>');
                    console.log(JSON.stringify(input, '', 4));
                    console.log('=> output =>');
                    console.log(JSON.stringify(_output, '', 4));
                    console.log('=> session storage =>');
                    console.log(JSON.stringify(api.sessionStorage, '', 4));

                    finish_task_callback(null);
                    return;

                }
            );


        },
        function buyer_makePurchaseTransaction(finish_task_callback) {

            var input = {
                buyerPrivateKey : api.sessionStorage.buyer.wallet.privateKey,
                buyerAddressOfUnspents : api.sessionStorage.buyer.wallet.addresses[0],
                sellerAddress : api.sessionStorage.seller.wallet.addresses[0],
                costOfPurchase : 14000,
                transactionFee : 10000
            }

            api.buyer.makeTransactionForPurchase.method(input,
                function (_output) {

                    api.sessionStorage.buyer.purchase  = {
                        transactionId : _output.transactionId
                    };

                    console.log('##================================================================================================');
                    console.log('##.Task 4 buyer.buyer_makePurchaseTransaction  ======================');
                    console.log('##================================================================================================');
                    console.log('=> input =>');
                    console.log(JSON.stringify(input, '', 4));
                    console.log('=> output =>');
                    console.log(JSON.stringify(_output, '', 4));
                    console.log('=> session storage =>');
                    console.log(JSON.stringify(api.sessionStorage, '', 4));

                    finish_task_callback(null);
                    return;

                }
            );


        },
        
        function seller_recognizeIncomeTransaction(finish_task_callback) {

            // Later we can just scan our sessionStorage
            var input = {
                transactionId : api.sessionStorage.buyer.purchase.transactionId,
                //sellerAddress : api.sessionStorage.seller.wallet.addresses[0]
            }

            api.seller.recognizeIncomeTransaction.method(input,
                function (_output) {

                    api.sessionStorage.seller.incomeTransactions.push(_output);

                    console.log('##================================================================================================');
                    console.log('##.Task 5 buyer.seller_recognizeIncomeTransaction  ======================');
                    console.log('##================================================================================================');
                    console.log('=> input =>');
                    console.log(JSON.stringify(input, '', 4));
                    console.log('=> output =>');
                    console.log(JSON.stringify(_output, '', 4));
                    console.log('=> session storage =>');
                    console.log(JSON.stringify(api.sessionStorage, '', 4));

                    finish_task_callback(null);
                    return;

                }
            );


        },
        
        function buyer_signMessage(finish_task_callback) {

            var input = {
                message : "I have been here a few times and is the best second pizza I 've eaten , of course mine been the best !  I gave this a five because of the food ! But staff an specially cashiers need to be more friendly ! Lady a the cash register was texting while she was taking our order . Not good !!! And she was not very nice .  But margarita was awesome!",
                privateKey : api.sessionStorage.buyer.wallet.privateKey
            };

            api.buyer.signMessage.method(input,
                function (_output) {

                    api.sessionStorage.buyer.review = {
                        message : input.message,
                        signatureDER : _output.signatureDER
                    };

                    console.log('##================================================================================================');
                    console.log('##.Task 6 buyer.buyer_signMessage  ======================');
                    console.log('##================================================================================================');
                    console.log('=> input =>');
                    console.log(JSON.stringify(input, '', 4));
                    console.log('=> output =>');
                    console.log(JSON.stringify(_output, '', 4));
                    console.log('=> session storage =>');
                    console.log(JSON.stringify(api.sessionStorage, '', 4));

                    finish_task_callback(null);
                    return;

                }
            );


        },        
        function seller_findBuyerByMessageAndSignature(finish_task_callback) {

            var input = {
                message : api.sessionStorage.buyer.review.message,
                signatureDER : api.sessionStorage.buyer.review.signatureDER,
                incomeTransactions : api.sessionStorage.seller.incomeTransactions
            };

            api.seller.findBuyerByMessageAndSignature.method(input,
                function (_output) {

                    console.log('##================================================================================================');
                    console.log('##.Task 7 seller.verificationResult  ======================');
                    console.log('##================================================================================================');
                    console.log('=> input =>');
                    console.log(JSON.stringify(input, '', 4));
                    console.log('=> output =>');
                    console.log(JSON.stringify(_output, '', 4));

                    if (_output.verificationResult == true) {
                        _output.buyerTransaction.signagureDER = input.signatureDER;
                        _output.buyerTransaction.message = input.message;
                    }

                    console.log('=> session storage =>');
                    console.log(JSON.stringify(api.sessionStorage, '', 4));

                    finish_task_callback(null);
                    return;

                }
            );
        },
        
        function seller_storeReviewHashIntoBlockChain(finish_task_callback) {

            var input = {
                message : api.sessionStorage.buyer.review.message,
                privateKey : api.sessionStorage.seller.wallet.privateKey,
                addressOfUnspents : api.sessionStorage.seller.wallet.addresses[0]
            };

            api.seller.storeReviewHashIntoBlockChain.method(input,
                function (_output) {

                    console.log('##================================================================================================');
                    console.log('##.Task 8 seller.dataStoredInBlockChain  ======================');
                    console.log('##================================================================================================');
                    console.log('=> input =>');
                    console.log(JSON.stringify(input, '', 4));
                    console.log('=> output =>');
                    console.log(JSON.stringify(_output, '', 4));

                    //_output.linkToCheck = 'https://test.helloblock.io/transactions/' + _output.transactionId;
                    _output.linkToCheck = 'http://explorer.chain.com/transactions/' + _output.transactionId;                    
                    
                    api.sessionStorage.seller.reviewDataTransactions.push(_output);

                    console.log('=> session storage =>');
                    console.log(JSON.stringify(api.sessionStorage, '', 4));

                    finish_task_callback(null);
                    return;

                }
            );
            


        }
        
    ],
    function (err) {

        console.log('==================  Ho ho everything is completed   ==============');

    });
