exports.api = {
    buyer : {
        createWallet : {
            method : require('./buyer-createWallet.js').main,
            input : null,
            output : {
                addresses : null,
                privateKey : null,
                linkToCheck : null
            }
        },

        withdrawTestBitCoinsFromFaucet : {
            method : require('./buyer-withdrawTestBitCoinsFromFaucet.js').main,
            input : {
                address : null,
                valueToWithDraw : null
            },
            output : {
                transactionId : null
            }
        },

        makeTransactionForPurchase : {
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

        },

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

    },
    seller : {

        createWallet : {
            method : require('./seller-createWallet.js').main,
            in : null,
            out : {
                addresses : null,
                privateKey : null,
                linkToCheck : null
            }
        },
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
        findBuyerByMessageAndSignature : {
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
        },
        storeReviewHashIntoBlockChain : {
            method : require('./seller-storeReviewHashIntoBlockChain.js').main,
            in : {
                message : null,
                privateKey : null,
                addressOfUnspents : null
            },
            out : {
                dataStoredInBlockChain : null,
                transactionId : null                
            }
        }


    },
    sessionStorage : {
        buyer : {
            wallet : null,
            faucetWithdrawal : {
                transactionId : null,
                linkToCheck : null
            },
            purchase : {
                transactionId : null
            },
            review : {
                message : null,
                signatureDER : null
            }
        },
        seller : {
            wallet : null,
            incomeTransactions : [],
            reviewDataTransactions : []

        }
    }

};
