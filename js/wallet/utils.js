// Conversion of standars integer to satoshis
function convertAmountFormat(amount = 0, invert = false, decimals = 0) {
    if (!invert) {
        return parseFloat((amount / Math.pow(10, decimals)).toFixed(decimals))
    }
    else {
        return parseInt(amount * Math.pow(10, decimals))
    }
}

function formatHash(hashes) {
	if (hashes >= 1000000000000000000000) {
		return (hashes / 1000000000000000000000).toFixed(2) + ' Zh/s'
	} else if (hashes >= 1000000000000000000) {
		return (hashes / 1000000000000000000).toFixed(2) + ' Eh/s'
	} else if (hashes >= 1000000000000000) {
		return (hashes / 1000000000000000).toFixed(2) + ' Ph/s'
	} else if (hashes >= 1000000000000) {
		return (hashes / 1000000000000).toFixed(2) + ' Th/s'
	} else if (hashes >= 1000000000) {
		return (hashes / 1000000000).toFixed(2) + ' Gh/s'
	} else if (hashes >= 1000000) {
		return (hashes / 1000000).toFixed(2) + ' Mh/s'
	} else if (hashes >= 1000) {
		return (hashes / 1000).toFixed(2) + ' Kh/s'
	} else {
		return hashes + ' H/s'
	}
}

function setLang(page) {

    if (localStorage['lang'] == null) {

        if (page != "index") {
            $("#create-wallet").text(lang['en']['create-wallet'])
            $("#import-wallet").text(lang['en']['import-wallet'])
            $("#your-wallet").text(lang['en']['your-wallet'])
            $("#send").text(lang['en']['send'])
            $("#tx-history").text(lang['en']['tx-history'])
            $("#chain-info").text(lang['en']['chain-info'])
            $("#settings").text(lang['en']['settings'])

            $("#part1").text(lang['en']['logoutreminder']['part1'])
            $("#logoutlink").text(lang['en']['logoutreminder']['logoutlink'])
            $("#part2").text(lang['en']['logoutreminder']['part2'])
        }

        if (page == "balance") {
            $("#balance-aok").text(lang['en']['balance-aok'])
            $("#balance-token").text(lang['en']['balance-token'])
        }
        else if (page == "chaininfo") {
            $("#block-height").text(lang['en']['block-height'])
            $("#net-hash").text(lang['en']['net-hash'])
            $("#circ-supply").text(lang['en']['circ-supply'])
    
        }
        else if (page == "import") {
            $("#legacy").text(lang['en']['legacy'])
            $("#wifImport").text(lang['en']['wifImport'])
            $("#seedImport").text(lang['en']['seedImport'])
            $("#import-wif").text(lang['en']['wifImport'])
            $("#import-seed").text(lang['en']['seedImport'])

            alert_wif_success = lang['en']['alert_wif_success']
            alert_wif_invalid = lang['en']['alert_wif_invalid']
            alert_seed_success = lang['en']['alert_seed_success']
            alert_seed_invalid = lang['en']['alert_seed_invalid']
        }
        else if (page == "index") {
            $("#create-wallet-button").text(lang['en']['create-wallet-button'])
            $("#import-wallet-button").text(lang['en']['import-wallet-button'])
        }
        else if (page == "main") {
            $("#generateAddress").text(lang['en']['generateAddress'])
            $("#addressTypeLabel").text(lang['en']['addressTypeLabel'])
            $("#your-address").text(lang['en']['your-address'])
            $("#your-wif").text(lang['en']['your-wif'])
            $("#your-seed").text(lang['en']['your-seed'])
            $("#importantmsg").text(lang['en']['importantmsg'])
            alertmsg = lang['en']['alertmsg']
        }
        else if (page == "send") {
            $("#send-to").text(lang['en']['send-to'])
            $("#send-to-token").text(lang['en']['send-to'])
            $("#amount-aok").text(lang['en']['amount-aok'])
            $("#amount-token").text(lang['en']['amount-aok'])
            $("#sendTx").text(lang['en']['sendTx'])
            $("#sendTokenTx").text(lang['en']['sendTx'])
            errororsuccess = lang['en']['showErrororSuccess']
        }
        else {
            return
        }
    }
    else {
        if (page != "index") {
            $("#create-wallet").text(lang[localStorage['lang']]['create-wallet'])
            $("#import-wallet").text(lang[localStorage['lang']]['import-wallet'])
            $("#your-wallet").text(lang[localStorage['lang']]['your-wallet'])
            $("#send").text(lang[localStorage['lang']]['send'])
            $("#tx-history").text(lang[localStorage['lang']]['tx-history'])
            $("#chain-info").text(lang[localStorage['lang']]['chain-info'])
            $("#settings").text(lang[localStorage['lang']]['settings'])

            $("#part1").text(lang[localStorage['lang']]['logoutreminder']['part1'])
            $("#logoutlink").text(lang[localStorage['lang']]['logoutreminder']['logoutlink'])
            $("#part2").text(lang[localStorage['lang']]['logoutreminder']['part2'])
        }

        if (page == "balance") {
            $("#balance-aok").text(lang[localStorage['lang']]['balance-aok'])
            $("#balance-token").text(lang[localStorage['lang']]['balance-token'])
        }
        else if (page == "chaininfo") {
            $("#block-height").text(lang[localStorage['lang']]['block-height'])
            $("#net-hash").text(lang[localStorage['lang']]['net-hash'])
            $("#circ-supply").text(lang[localStorage['lang']]['circ-supply'])
    
        }
        else if (page == "import") {
            $("#legacy").text(lang[localStorage['lang']]['legacy'])
            $("#wifImport").text(lang[localStorage['lang']]['wifImport'])
            $("#seedImport").text(lang[localStorage['lang']]['seedImport'])
            $("#import-wif").text(lang[localStorage['lang']]['wifImport'])
            $("#import-seed").text(lang[localStorage['lang']]['seedImport'])

            alert_wif_success = lang[localStorage['lang']]['alert_wif_success']
            alert_wif_invalid = lang[localStorage['lang']]['alert_wif_invalid']
            alert_seed_success = lang[localStorage['lang']]['alert_seed_success']
            alert_seed_invalid = lang[localStorage['lang']]['alert_seed_invalid']
        }
        else if (page == "index") {
            $("#create-wallet-button").text(lang[localStorage['lang']]['create-wallet-button'])
            $("#import-wallet-button").text(lang[localStorage['lang']]['import-wallet-button'])
        }
        else if (page == "main") {
            $("#generateAddress").text(lang[localStorage['lang']]['generateAddress'])
            $("#addressTypeLabel").text(lang[localStorage['lang']]['addressTypeLabel'])
            $("#your-address").text(lang[localStorage['lang']]['your-address'])
            $("#your-wif").text(lang[localStorage['lang']]['your-wif'])
            $("#your-seed").text(lang[localStorage['lang']]['your-seed'])
            $("#importantmsg").text(lang[localStorage['lang']]['importantmsg'])
            alertmsg = lang[localStorage['lang']]['alertmsg']
        }
        else if (page == "send") {
            $("#send-to").text(lang[localStorage['lang']]['send-to'])
            $("#send-to-token").text(lang[localStorage['lang']]['send-to'])
            $("#amount-aok").text(lang[localStorage['lang']]['amount-aok'])
            $("#amount-token").text(lang[localStorage['lang']]['amount-aok'])
            $("#sendTx").text(lang[localStorage['lang']]['sendTx'])
            $("#sendTokenTx").text(lang[localStorage['lang']]['sendTx'])
            errororsuccess = lang[localStorage['lang']]['showErrororSuccess']
        }
        else {
            return
        }
    }
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

    console.log(network)

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

async function apiCall(call, params = {}) {
    var callstring = `${api}/${call}`
    if (params) {
        var index = 0
        for (const [key, value] of Object.entries(params)) {
            if (index == 0) {
                callstring += `/${value}`
            }
            else if (index == 1){
                callstring += `?${key}=${value}`
            }
            else {
                callstring += `&${key}=${value}`
            }
            index += 1
        }
        const data = await Promise.resolve($.ajax({
            url: callstring,
            dataType: 'json',
            type: 'GET'
        }))
        return data
    }
    else {
        const data = await Promise.resolve($.ajax({
            url: callstring,
            dataType: 'json',
            type: 'GET'
        }))
        return data
    }
}

function setHref(address) {
    $("#history").attr("href", explorer + address)
}


function tokenBalance(amount, units) {
    return amount / 10 ** units
}