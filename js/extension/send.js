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

    // Set history page to open to explorer & sets placeholder to testnet or mainnet prefix
    setHref(address)
    AOKinputPlaceholder.attr("placeholder", "Kdc...")
    TokeninputPlaceholder.attr("placeholder", "Kdc...")

    $("#sendAok").addClass('active')

    setLang("send")

    apiCall("balance", {
        "address": address
    }).then((data) => {
        var result = data.result
        if (result.tokens.length == 0) {
            $("#tokenSelect")
            .append($("<option></option>")
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

    if (!validateAddress(receiver)) {
        alert("You have not specified an address to send to")
        return
    }

    ask = confirm("Confirm Transaction. You are about to send " + $("#amountAOK").val() + " AOK to " + receiver + ". The fee is " + feeShow + " AOK\nTotal Cost: " + amountShow + " AOK")
    if (ask){

        sendTransaction(address, wifKey, receiver, amount, fee, false, $("#showErrororSuccess"))

    }
    else {
        // User transaction canceled according to language set
        $("#showErrororSuccess").text(errororsuccess['error']['cancel'])
    }
})

// Send Token

$("#sendTokenTx").click(function () {
    var name = $("#tokenSelect option:selected").text()

    var feeinput = document.getElementById("sendTokenFee")
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

    var receiver = $("#sendInputToken").val()

    apiCall("balance", {
        "address": address
    }).then((data) => {
        tokens = []

        for (var i = 0; i < data.result.tokens.length; i++) {
            tokens.push(data.result.tokens[i].tokenName)
        }

        if (!tokens.includes(name)) {
            showErrororSuccess.text("You do not have that token")
            return
        }

        var tokenAmount = convertAmountFormat(parseFloat($("#amountToken").val()), true, 8)
        var tokenAmountShow = convertAmountFormat(tokenAmount, false, 8)

        if (!validateAddress(receiver)) {
            alert("You have not specified an address to send to")
            return
        }

        var ask = confirm("Confirm Transaction. You are about to send " + $("#amountToken").val() + " " + name + " to " + receiver + ". The fee is " + feeShow + " AOK\nTotal Cost: " + tokenAmountShow + " " + name + " with an additional fee of " + feeShow + " AOK")

        if (ask) {

            $("#showErrororSuccessToken").text("Building tx...")

            sendTransaction(address, wifKey, receiver, tokenAmount, fee, true, $("#showErrororSuccessToken"))

        }
        else {
            showErrororSuccess.text(errororsuccess['error']['cancel'])
        }
    })


})

// Reset the values after user sends
function resetForms() {
    $("#amountAOK").val('')
    $("#sendInputAOK").val('')
    $("#sendAOKfee").val('')
    $("#amountToken").val('')
    $("#sendInputToken").val('')
    $("#sendTokenFee").val('')
}

