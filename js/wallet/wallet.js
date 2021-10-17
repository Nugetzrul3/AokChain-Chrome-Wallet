function sendTransaction(sender, senderKey, receiver, amount, fee, token = false, successElement) {
    successElement.text("Building tx...")
    
    var txbuilder = new bitcoin.TransactionBuilder(netconfig['network'])
    txbuilder.setVersion(1)
    var hashType = bitcoin.Transaction.SIGHASH_ALL
    var wif = bitcoin.ECPair.fromWIF(senderKey, netconfig['network'])
    
    if (!token) {
        txbuilder.addOutput(receiver, (amount - fee))

        apiCall("unspent", {
            'address': sender,
            'amount': parseInt(amount, 10)
        }).then((data) => {
            var txval = 0
            
            for (var i = 0; i < data.result.length; i++) {
                var utxo = data.result[i]
                var txid = utxo.txid
                var index = utxo.index

                txval += utxo.value

                txbuilder.addInput(txid, index)
            }

            if (txval >= amount) {
                var change = txval - amount

                if (change > 0) {
                    txbuilder.addOutput(address, change)
                }

                for (var j = 0; j < txbuilder.__INPUTS.length; j++) {
                    txbuilder.sign(j, wif)
                }
            }
            else {
                // Fund error according to language set
                successElement.text(errororsuccess['error']['funds'])
                return
            }

            postTransaction(txbuilder.build().toHex(), $("#showErrororSuccess"))
            return
        })
    }
    else {
        var valuetoken = 0
        var valueaok = 0
        var scripts = []

        var name = $("#tokenSelect option:selected").text()

        var promises = [
            apiCall("info"),
            apiCall("unspent", {"address": sender, "amount": amount, "token": name}),
            apiCall("unspent", {"address": sender, "amount": fee})
        ]

        Promise.all(promises).then(function (values) {
            var network = values[0]
            var tokenutxo = values[1]
            var aokutxo = values[2]

            for (var i = 0; i < aokutxo.result.length; i++) {
                var timestamp = parseInt(Date.now() / 1000)
                var utxo = aokutxo.result[i]
                var txid = utxo.txid
                var index = utxo.index
                var script = bitcoin.Buffer(utxo.script, "hex")

                var decode = bitcoin.script.decompile(script)

                if (decode.includes(bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY)) {
                    if (bitcoin.Buffer.isBuffer(decode[0])) {
                        if (decode[0].readUIntLE(0, decode[0].length) <= 50000000) {
                            txbuilder.setLockTime(network.result.blocks)
                        }
                        else {
                            txbuilder.setLockTime(timestamp)
                        }
                    }
                    else {
                        txbuilder.setLockTime(network.result.blocks)
                    }

                    txbuilder.addInput(txid, index, 0xfffffffe)
                }
                else {
                    txbuilder.addInput(txid, index)
                }
                
                valueaok += utxo.value
                scripts.push(script)
            }

            for (var i = 0; i < tokenutxo.result.length; i++) {
                var utxo = tokenutxo.result[i]
                var script = bitcoin.Buffer(utxo.script, "hex")
                var txid = utxo.txid
                var index = utxo.index
                valuetoken += utxo.value

                txbuilder.addInput(txid, index)
                scripts.push(script)
            }

            var changetoken = valuetoken - amount

            if (valuetoken < amount) {

                if (changetoken > 0) {
                    txbuilder.addOutput(tokenOutput(address, {
                        "name": name,
                        "amount": changetoken
                    }), 0)
                }

                if (valueaok >= fee) {
                    var changeaok = txvalueaok - fee

                    if (changeaok > 0) {
                        txbuilder.addOutput(address, changeaok)
                    }

                    var inctx = txbuilder.buildIncomplete()

                    for (var i = 0; i < scripts.length; i++) {
                        const sigHash = inctx.hashForSignature(i, scripts[i], hashType)

                        inctx.setInputScript(i, bitcoin.script.compile([
                            bitcoin.script.signature.encode(wif.sign(sigHash), hashType),
                            keys.publicKey
                        ]))
                    }

                    postTransaction(inctx.toHex(), $("#showErrororSuccessToken"))
                    return
                }
                else {
                    successElement.text(errororsuccess['error']['funds'])
                    return
                }
            }
            else {
                successElement.text("You do not have enough " + name + " to send that amount.")
                return
            }
        })
    }
}

function postTransaction(signedtx, successElement) {

    console.log(signedtx)

    successElement.text("Sending Transaction...")

    // Broadcast the transaction to the network
    Promise.resolve($.ajax({
        'url': api + '/broadcast',
        'method': 'POST',
        'data': {
            'raw': signedtx
        }
    })).then(function(data) {
        if (data.error == null) {
            // Success message according to language set
            successElement.text(errororsuccess['success'] + data.result)
            resetForms()
            return
        }
        else {
            // Broadcast error according to language set
            successElement.text(errororsuccess['error']['broadcast'] + data.error.message)
            resetForms()
            return
        }
    })
}

function updateFee() {
    apiCall("/fee")
    .then((data) => {
        feerate = data.result.feerate
        $("#sendTokenFee").attr("placeholder", `Fee: (Default ${convertAmountFormat(feerate, false, 8)} AOK)`)
        $("#sendAOKfee").attr("placeholder", `Fee: (Default ${convertAmountFormat(feerate, false, 8)} AOK)`)
    })
}

function importAddress(wif_or_seed) {

    if (wif_or_seed.length == 52 || wif_or_seed.length == 51) {

        var wif = wif_or_seed
    
        var wifKey = bitcoin.ECPair.fromWIF(wif, netconfig['network'])

        return bitcoin.payments.p2pkh({'pubkey': wifKey.publicKey, 'network': netconfig['network']}).address
    }
    else if (wif_or_seed.split(" ").length == 12) {
        
        var seed = wif_or_seed

        var seed = bip39.mnemonicToSeedSync(seed)
        var hdMaster = bitcoin.bip32.fromSeed(seed, netconfig['network'])
        var childNode = hdMaster.derivePath(`${path}0`).derive(0)
    
        return bitcoin.payments.p2pkh({'pubkey': childNode.publicKey, 'network': netconfig['network']}).address
    }
}

function generateAddress() {
    var mnemonic = bip39.generateMnemonic()
    var seed = bip39.mnemonicToSeedSync(mnemonic)
    var hdMaster = bitcoin.bip32.fromSeed(seed, netconfig['network'])
    var childNode = hdMaster.derivePath(`${path}0`).derive(0)

    return bitcoin.payments.p2pkh({'pubkey': childNode.publicKey, 'network': netconfig['network']}).address, childNode.toWIF()
}



