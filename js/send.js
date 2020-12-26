var wif
var wifKey
var address
var api
var feerate
window.onload = function() {
    // Get WIF and address from local storage
    wifKey = localStorage.getItem("wifKey")
    address = localStorage.getItem("address")

    // Define variable to set placeholder if user chooses mainnet or testnet
    var AOKinputPlaceholder = $("#sendInputAOK")
    var TokeninputPlaceholder = $("#sendInputToken")

    // Set overlay.js to open to send page
    localStorage.setItem("opened", "send.html")

    setSendPageLang()

    apiget = localStorage.getItem("apiSet")

    // Set history page to open to explorer & sets placeholder to testnet or mainnet prefix

    api = "https://api.aok.network"

    var href = "https://explorer.aok.network/#/address/" + address
    AOKinputPlaceholder.attr("placeholder", "Kdc...")
    TokeninputPlaceholder.attr("placeholder", "Kdc...")

    $("#history").attr("href", href)

    $("#sendAok").addClass('active')

    Promise.resolve($.ajax({
        url: api + "/balance/" + address,
        dataType: 'json',
        type: 'GET'
    })).then(function(data) {
        var result = data.result
        if (result.tokens.length == 0) {
            $("#tokenSelect")
            .append($('<option></option>')
            .attr("value", 0)
            .text("None"))
        }
        else {
            for (var i = 0; i < result.tokens.length; i++) {
                var token = result.tokens[i]
                $("#tokenSelect")
                .append($("<option></option>")
                .attr("value", i)
                .text(token.tokenName))
            }
        }
    })
    updateFee()
    setInterval(function () {
        updateFee()
    }, 10000)
}

var errororsuccess

var netconfig = {
    'network': {
        'messagePrefix': '\x19AokChain Signed Message:\n',
        'bip32': {
            'public': 0x0488B21E,
            'private': 0x0488ADE4
        },
        'pubKeyHash': 0x2E,
        'scriptHash': 0x6C,
        'wif': 0xFF
    }
}

$("#sendTx").click(function () {
    var feeinput = document.getElementById("sendAOKfee")
    var fee = undefined
    var feeShow = undefined
    if (feeinput && feeinput.value) {
        fee = convertAmountFormat(feeinput.value, true, 8)
        feeShow = convertAmountFormat(fee, false, 8)
    }
    else {
        fee = feerate
        feeShow = convertAmountFormat(fee, false, 8)
    }
    // Don't put fee in convertion of amount format
    var amount = convertAmountFormat(parseFloat($("#amountAOK").val()), true, 8) + fee
    var amountShow = convertAmountFormat(amount, false, 8)
    var receiver = $("#sendInputAOK").val()

    var scripts = []

    if (!validateAddress(receiver)) {
        alert("You have not specified an address to send to")
        return
    }

    ask = confirm("Confirm Transaction. You are about to send " + $("#amountAOK").val() + " AOK to " + receiver + ". The fee is " + feeShow + " AOK\nTotal Cost: " + amountShow + " AOK")
    if (ask){
        var showErrororSuccess = $("#showErrororSuccess")
        showErrororSuccess.text("Sending Transaction...")

        wif = bitcoin.ECPair.fromWIF(wifKey, netconfig['network'])

        // Get unspent values to calculate change and sending value
        Promise.resolve($.ajax({
            url: api + "/unspent/" + address + "?amount=" + parseInt(amount, 10),
            dataType: 'json',
            type: 'GET'
        })).then(function(data) {

            var txbuilder = new bitcoin.TransactionBuilder(netconfig['network'])
            txbuilder.setVersion(1)

            txbuilder.addOutput(receiver, (amount - fee))
            
            var txvalue = 0
            for (var i = 0, size = data.result.length; i < size; i++) {
                var prevtxid = data.result[i].txid
                var txindex = data.result[i].index
                txvalue += data.result[i].value

                var script = bitcoin.Buffer(data.result[i].script, 'hex')
                var typeofaddress = scriptType(script)

                if (typeofaddress == 'bech32') {
                    var bech32script = bitcoin.payments.p2wpkh({'pubkey': wif.publicKey, 'network': netconfig['network']})

                    txbuilder.addInput(prevtxid, txindex, null, bech32script.output)
                }

                else {
                    txbuilder.addInput(prevtxid, txindex)
                }

                scripts.push({'script': script, 'type': typeofaddress, 'value': data.result[i].value})
            }

            if (txvalue >= amount) {
                var txchange = txvalue - amount
                // If the change is greater than 0, send the change back to the sender
                if (txchange > 0) {
                    // Send change back to sender
                    txbuilder.addOutput(address, txchange)
                }

                for (var i = 0, size = scripts.length; i < size; i++){
                    switch (scripts[i].type) {
                        
                        case 'legacy':
                            txbuilder.sign(i, wif)
                            break
                        
                        default:
                            showErrororSuccess.text("Bad UTXO")

                    }
                }
                var txfinal = txbuilder.build()
                
                // Broadcast the transaction to the network
                Promise.resolve($.ajax({
                    'url': api + '/broadcast',
                    'method': 'POST',
                    'data': {
                        'raw': txfinal.toHex()
                    }
                })).then(function(data) {
                    if (data.error == null) {
                        // Success message according to language set
                        showErrororSuccess.text(errororsuccess['success'] + data.result)
                    }

                    else {
                        // Broadcast error according to language set
                        showErrororSuccess.text(errororsuccess['error']['broadcast'] + data.error.message)
                    }

                    resetFormAOK()
                })
                
            }

            else {
                // Fund error according to language set
                showErrororSuccess.text(errororsuccess['error']['funds'])
            }
        })
    }
    else {
        // User transaction canceled according to language set
        var showErrororSuccess = $("#showErrororSuccess")
        showErrororSuccess.text(errororsuccess['error']['cancel'])
    }
})

// Send Token

$("#sendTokenTx").click(function () {
    var showErrororSuccess = $("#showErrororSuccessToken")
    var name = $("#tokenSelect option:selected").text()

    var feeinput = document.getElementById("sendTokenFee")
    var fee = undefined
    var feeShow = undefined
    if (feeinput && feeinput.value) {
        console.log("test")
        fee = convertAmountFormat(feeinput.value, true, 8)
        feeShow = convertAmountFormat(fee, false, 8)
    }
    else {
        fee = feerate
        feeShow = convertAmountFormat(fee, false, 8)
    }

    var receiver = $("#sendInputToken").val()
   
    wif = bitcoin.ECPair.fromWIF(wifKey, netconfig['network'])

    getDecimals().then(function (data) {
        var units = 0
        for (var i = 0; i < data.result.tokens.length; i++) {
            var token = data.result.tokens[i]
            if (token.tokenName == name) {
                units = token.units
            }
        }

        var tokenAmount = convertAmountFormat(parseFloat($("#amountToken").val()), true, units)
        var tokenAmountShow = convertAmountFormat(tokenAmount, false, units)

        if (!validateAddress(receiver)) {
            alert("You have not specified an address to send to")
            return
        }

        var ask = confirm("Confirm Transaction. You are about to send " + $("#amountToken").val() + " " + name + " to " + receiver + ". The fee is " + feeShow + " AOK\nTotal Cost: " + tokenAmountShow + " " + name + " with an additional fee of " + feeShow + " AOK")

        if (ask) {
            showErrororSuccess.text("Sending Transaction...")

            var hashType = bitcoin.Transaction.SIGHASH_ALL
            var tokenscripts = []
            var aokscripts = []

            var txbuilder = new bitcoin.TransactionBuilder(netconfig["network"])
            txbuilder.setVersion(1)

            if (name == "CCA") {
                txbuilder.addOutput(receiver, tokenAmount)
            }
            else {
                txbuilder.addOutput(tokenOutput(receiver, {
                    "name": name, 
                    "amount": tokenAmount
                }), 0)
            }

            var txvaluetoken = 0
            var txvalueaok = 0

            var promises = [
                netInfo(),
                tokenUnspent(address, tokenAmount, name),
                AOKUnspent(address, 100000000 + fee)
            ]

            Promise.all(promises).then(function (values) {
                var network = values[0]
                var tokenutxo = values[1]
                var aokutxo = values[2]

                for (var i = 0; i < tokenutxo.result.length; i++) {
                    var timestamp = parseInt(Date.now() / 1000)
                    var utxo = tokenutxo.result[i]
                    var txid = utxo.txid
                    var index = utxo.index
                    var script = bitcoin.Buffer(utxo.script, "hex")
                    txvaluetoken += utxo.value

                    if (name == "CCA") {
                        var decode = bitcoin.script.decompile(script)

                        if (decode.includes(bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY)) {
                            if (Buffer.isBuffer(decode[0])) {
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
                    }
                    else {
                        txbuilder.addInput(txid, index)
                    }

                    tokenscripts.push(script)
                }

                var send = true
                var txchangetoken = 0

                if (txvaluetoken < tokenAmount) {
                    send = false
                }
                else {
                    txchangetoken = txvaluetoken - tokenAmount
                }

                if (send) {

                    if (txchangetoken > 0) {
                        if (name == "CCA") {
                            txbuilder.addOutput(address, txchangetoken)
                        }
                        else {
                            txbuilder.addOutput(tokenOutput(address, {
                                "name": name,
                                "amount": txchangetoken
                            }), 0)
                        }
                    }

                    console.log(aokutxo)
                    console.log(aokutxo.result.length)

                    for (var i = 0; i < aokutxo.result.length; i++) {
                        var utxo = aokutxo.result[i]
                        console.log(i)
                        var txid = utxo.txid
                        var index = utxo.index
                        var script = bitcoin.Buffer(utxo.script, "hex")
                        var typeofaddress = scriptType(script)
                        txvalueaok += utxo.value

                        if (typeofaddress == "bech32") {
                            var bech32script = bitcoin.payments.p2wpkh({'pubkey': wif.publicKey, 'network': netconfig['network']})

                            txbuilder.addInput(txid, index, null, bech32script.output)
                        }
                        else {
                            txbuilder.addInput(txid, index)
                        }

                        aokscripts.push({'script': script, 'type': typeofaddress, 'value': utxo.value})
                    }

                    if (txvalueaok >= 100000000 + fee) {
                        var txchangeaok = txvalueaok - (100000000 + fee)

                        if (txchangeaok > 0) {
                            txbuilder.addOutput(address, txchangeaok)
                        }
                    

                        for (var i = 0; i < aokscripts.length; i++) {
                            switch (aokscripts[i].type) {
                                case 'legacy':
                                    txbuilder.sign(i, wif)
                                    break
                                default:
                                    showErrororSuccess.text("Bad UTXO")
                            }
                        }

                        var inctx = txbuilder.buildIncomplete()

                        for (var i = 0; i < tokenscripts.length; i++) {
                            const sigHash = inctx.hashForSignature(i, tokenscripts[i], hashType)
                            const keys = bitcoin.ECPair.fromWIF(wifKey, netconfig['network'])

                            inctx.setInputScript(i, bitcoin.script.compile([
                                bitcoin.script.signature.encode(keys.sign(sigHash), hashType),
                                keys.publicKey
                            ]))
                        }

                        Promise.resolve($.ajax({
                            url: api + "/broadcast",
                            type: 'POST',
                            data: {
                                'raw': inctx.toHex()
                            }
                        })).then(function (data) {
                            if (data.error == null) {
                                showErrororSuccess.text(errororsuccess['success'] + data.result)
                            }
                            else {
                                showErrororSuccess.text(errororsuccess['error']['broadcast'] + data.error.message)
                            }
                        })

                        resetFormToken()
                    }
                    else {
                        showErrororSuccess.text(errororsuccess['error']['funds'])
                    }
                }
                else {
                    showErrororSuccess.text("You do not have enough " + name + " to send that amount.")
                }


            })
        }
        else {
            showErrororSuccess.text(errororsuccess['error']['cancel'])
        }
    })


})

// Get type of address given the script hash
function scriptType(script) {
    var type = undefined

    if (script[0] == bitcoin.opcodes.OP_DUP && script[1] == bitcoin.opcodes.OP_HASH160 && script[2] == 20) {
        type = 'legacy'
    }

    return type

}

function updateFee() {
    Promise.resolve($.ajax({
        url: api + "/fee",
        type: 'GET',
        dataType: 'json'
    }))
    .then(function (data) {
        feerate = data.result.feerate
        $("#sendTokenFee").attr("placeholder", `Fee: (Default ${convertAmountFormat(feerate, false, 8)} AOK)`)
        $("#sendAOKfee").attr("placeholder", `Fee: (Default ${convertAmountFormat(feerate, false, 8)} AOK)`)
    })
}

// Reset the values after user sends
function resetFormAOK() {
    $("#amountAOK").val('')
    $("#sendInputAOK").val('')
    $("#sendAOKfee").val('')
}

function resetFormToken() {
    $("#amountToken").val('')
    $("#sendInputToken").val('')
    $("#sendTokenFee").val('')
}

function validateAddress(address) {
    try {
        bitcoin.address.fromBase58Check(address, netconfig.network)
        return true
    }
    catch (e) {
        return false
    }
}

async function getDecimals() {
    const data = await Promise.resolve($.ajax({
        url: api + "/balance/" + address,
        dataType: 'json',
        type: 'GET'
    }))
    return data
}

async function netInfo() {
    const data = await Promise.resolve($.ajax({
        url: api + "/info",
        type: 'GET',
        dataType: 'json'
    }))
    return data
}

async function tokenUnspent(address, amount, name) {
    const data = await Promise.resolve($.ajax({
        url: api + "/unspent/" + address + "?amount=" + parseInt(amount) + "&token=" + name,
        type: 'GET',
        dataType: 'json'
    }))
    return data
}

async function AOKUnspent(address, amount) {
    const data = await Promise.resolve($.ajax({
        url: api + "/unspent/" + address + "?amount=" + parseInt(amount),
        type: 'GET',
        dataType: 'json'
    }))
    return data
}

// Conversion of standars integer to satoshis
function convertAmountFormat(amount = 0, invert = false, decimals = 0) {
        if (!invert) {
            return parseFloat((amount / Math.pow(10, decimals)).toFixed(decimals))
        }
        else {
            return parseInt(amount * Math.pow(10, decimals))
        }
}


// Functions for sending token (Thanks @volbil :D)

function writeUInt64LE(buffer, value, offset) {
    buffer.writeInt32LE(value & -1, offset);
    buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4);
    return offset + 8;
}

function tokenOutput(address, token) {
    var network = netconfig.network
    var tokenBuffer = bitcoin.Buffer.allocUnsafe(3 + 1 + 1 + token.name.length + 8 + 4);
    var offset = 0;

    tokenBuffer.write("alp", offset);
    offset += 3;
    tokenBuffer.write("t", offset);
    offset += 1;
    tokenBuffer.writeUInt8(token.name.length, offset);
    offset += 1;
    tokenBuffer.write(token.name, offset);
    offset += token.name.length;
    writeUInt64LE(tokenBuffer, token.amount, offset);
    offset += 8;

    return bitcoin.script.compile([
        bitcoin.opcodes.OP_DUP,
        bitcoin.opcodes.OP_HASH160,
        bitcoin.address.fromBase58Check(address, network).hash,
        bitcoin.opcodes.OP_EQUALVERIFY,
        bitcoin.opcodes.OP_CHECKSIG,
        bitcoin.opcodes.OP_ALP_TOKEN,
        tokenBuffer,
        bitcoin.opcodes.OP_DROP,
    ])
}


// Multi Lang
var lang = {
    'en': {
        // Page text
        'send-to': "Send To: ",
        'amount-aok': "Amount: ",
        'sendTx': "Send Transaction",
        'showErrororSuccess': {
            'success': "Success! Transaction ID: ",
            'error': {
                'broadcast': "Broadcast Failed! Error: ",
                'funds': "Error: Not enough funds",
                'cancel': "Transaction Cancelled",
            },
        },
        'logoutreminder': {
            'part1': "Remember to",
            'logoutlink': "Logout",
            'part2': "before exiting Chrome",
        },


        // Tab text
        'create-wallet': "Create Wallet",
        'import-wallet': "Import Wallet",
        'your-wallet': "Your Wallet",
        'send': "Send",
        'tx-history': "History",
        'chain-info': "Chain Info",
        'settings': "Settings"
    },
    

    'fr': {
        // Page text
        'send-to': "Envoyer pour: ",
        'amount-aok': "Quantité: ",
        'sendTx': "Envoyer Transaction",
        'showErrororSuccess': {
            'success': "Succès! Transaction ID: ",
            'error': {
                'broadcast': "Diffuser Échoué! Erreur: ",
                'funds': "Erreur: Pas assez fonds",
                'cancel': "Transaction Annulé",
            },
        },
        'logoutreminder': {
            'part1': "Se souvenir de",
            'logoutlink': "Se Déconnecter",
            'part2': "avant de sortir Chrome",
        },

        // Tab text
        'create-wallet': "Créer Portefeuille",
        'import-wallet': "Importer Portefeuille",
        'your-wallet': "Votre Portefeuille",
        'send': "Envoyer",
        'tx-history': "L'histoire",
        'chain-info': "Chaîne Données",
        'settings': "Paramètres"        
    },

    'kr': {
        // Page text
        'send-to': "보내다 에게: ",
        'amount-aok': "양: ",
        'sendTx': "보내다 트랜잭션",
        'showErrororSuccess': {
            'success': "성공! 트랜잭션 ID: ",
            'error': {
                'broadcast': "방송 실패한! 오류: ",
                'funds': "오류: 부족한 자금",
                'cancel': "트랜잭션 취소 된",
            },
        },
        'logoutreminder': {
            'part1': "기억해",
            'logoutlink': "로그 아웃",
            'part2': "종료하기 전에",
        },

        // Tab text
        'create-wallet': "창조하다 지갑",
        'import-wallet': "수입 지갑",
        'your-wallet': "너의 지갑",
        'send': "보내다",
        'tx-history': "역사",
        'chain-info': "체인 정보",
        'settings': "설정"
    },

    'id': {
        // Page text
        'send-to': "Kirim Untuk: ",
        'amount-aok': "Jumlahnya: ",
        'sendTx': "Kirim Transaksi",
        'showErrororSuccess': {
            'success': "Keberhasilan! Transaksi ID: ",
            'error': {
                'broadcast': "Siaran Gagal! Kesalahan: ",
                'funds': "Kesalahan: Tidak cukup dana",
                'cancel': "Transaksi Dibatalkan",
            },
        },
        'logoutreminder': {
            'part1': "Ingat untuk",
            'logoutlink': "Keluar",
            'part2': "sebelum keluar Chrome",
        },

        // Tab text
        'create-wallet': "Membuat Dompet",
        'import-wallet': "Impor Dompet",
        'your-wallet': "Dompet Anda",
        'send': "Kirim",
        'tx-history': "Riwayat",
        'chain-info': "Data Rantai",
        'settings': "Pengaturan"
    },

    'es': {
        // Page text
        'send-to': "Enviar a: ",
        'amount-aok': "Cantidad: ",
        'sendTx': "Enviar Transacción",
        'showErrororSuccess': {
            'success': "Éxito! Transacción ID: ",
            'error': {
                'broadcast': "Transmitir Fracasado! Error: ",
                'funds': "Error: No es Suficiente fondos",
                'cancel': "Transacción Anulado",
            },
        },
        'logoutreminder': {
            'part1': "Recuerda a",
            'logoutlink': "Cerrar sesión",
            'part2': "antes de irse Chrome",
        },

        // Tab text
        'create-wallet': "Billetera Crear",
        'import-wallet': "Billetera Importar",
        'your-wallet': "Billetera Tu",
        'send': "Enviar",
        'tx-history': "Historia",
        'chain-info': "Informacion Red",
        'settings': "El Ajuste"
    },

    'ru': {
        // Page text
        'send-to': "послать к: ",
        'amount-aok': "сумма: ",
        'sendTx': "послать трансакция",
        'showErrororSuccess': {
            'success': "Success! трансакция ID: ",
            'error': {
                'broadcast': "передача не смогли! погрешность: ",
                'funds': "ошибка: Недостаточно фонды",
                'cancel': "трансакция отменен",
            },
        },
        'logoutreminder': {
            'part1': "Помните в",
            'logoutlink': "Выйти",
            'part2': "перед выходом",
        },

        // Tab text
        'create-wallet': "Создать кошелек",
        'import-wallet': "Импорт кошелька",
        'your-wallet': "Ваш кошелек",
        'send': "Отправить",
        'tx-history': "История",
        'chain-info': "Информация о сети",
        'settings': "Настройки"
    },

    'zh': {
        // Page text
        'send-to': "发送至: ",
        'amount-aok': "数量: ",
        'sendTx': "发送交易",
        'showErrororSuccess': {
            'success': "成功! 交易 ID: ",
            'error': {
                'broadcast': "广播失败! 错误: ",
                'funds': "错误: 资金不足",
                'cancel': "交易已取消",
            },
        },
        'logoutreminder': {
            'part1': "记得 至",
            'logoutlink': "登出",
            'part2': "退出前 Chrome",
        },

        // Tab text
        'create-wallet': "创建钱包",
        'import-wallet': "导入钱包",
        'your-wallet': "你的钱包",
        'send': "发送",
        'tx-history': "历史信息",
        'chain-info': "网络信息",
        'settings': "设置"
    },

    'ja': {
        // Page text
        'send-to': "に 送る: ",
        'amount-aok': "量: ",
        'sendTx': "送る トランザクション",
        'showErrororSuccess': {
            'success': "成功! トランザクション ID: ",
            'error': {
                'broadcast': "放送 失敗! エラー: ",
                'funds': "エラー: 十分ではない 資金",
                'cancel': "トランザクション キャンセル",
            },
        },
        'logoutreminder': {
            'part1': "覚えて に",
            'logoutlink': "ログアウト",
            'part2': "出る前に Chrome",
        },

        // Tab text
        'create-wallet': "作成する 財布",
        'import-wallet': "インポート 財布",
        'your-wallet': "きみの 財布",
        'send': "送る",
        'tx-history': "歴史",
        'chain-info': "通信網 情報",
        'settings': "設定"
    },
}

// Set Multi Lang
function setSendPageLang() {
    if (localStorage['lang'] == null) {
        // Page Text
        $("#send-to").text(lang['en']['send-to'])
        $("#amount-aok").text(lang['en']['amount-aok'])
        $("#sendTx").text(lang['en']['sendTx'])
        $("#part1").text(lang['en']['logoutreminder']['part1'])
        $("#logoutlink").text(lang['en']['logoutreminder']['logoutlink'])
        $("#part2").text(lang['en']['logoutreminder']['part2'])
        errororsuccess = lang['en']['showErrororSuccess']

        // Tab text
        $("#create-wallet").text(lang['en']['create-wallet'])
        $("#import-wallet").text(lang['en']['import-wallet'])
        $("#your-wallet").text(lang['en']['your-wallet'])
        $("#send").text(lang['en']['send'])
        $("#tx-history").text(lang['en']['tx-history'])
        $("#chain-info").text(lang['en']['chain-info'])
        $("#settings").text(lang['en']['settings'])        
    }
    
    else {
        // Page Text
        $("#send-to").text(lang[localStorage.getItem("lang")]['send-to'])
        $("#amount-aok").text(lang[localStorage.getItem("lang")]['amount-aok'])
        $("#sendTx").text(lang[localStorage.getItem("lang")]['sendTx'])
        $("#part1").text(lang[localStorage.getItem("lang")]['logoutreminder']['part1'])
        $("#logoutlink").text(lang[localStorage.getItem("lang")]['logoutreminder']['logoutlink'])
        $("#part2").text(lang[localStorage.getItem("lang")]['logoutreminder']['part2'])
        errororsuccess = lang[localStorage.getItem("lang")]['showErrororSuccess']

        // Tab text
        $("#create-wallet").text(lang[localStorage.getItem("lang")]['create-wallet'])
        $("#import-wallet").text(lang[localStorage.getItem("lang")]['import-wallet'])
        $("#your-wallet").text(lang[localStorage.getItem("lang")]['your-wallet'])
        $("#send").text(lang[localStorage.getItem("lang")]['send'])
        $("#tx-history").text(lang[localStorage.getItem("lang")]['tx-history'])
        $("#chain-info").text(lang[localStorage.getItem("lang")]['chain-info'])
        $("#settings").text(lang[localStorage.getItem("lang")]['settings'])        
    }
}
