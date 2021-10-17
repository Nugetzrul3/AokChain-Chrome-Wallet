var getaddress
var api
var prefix

window.onload = function (){
    // Get address from local storage
    var address = localStorage.getItem("address")

    // Set overlay.js to open to balance page
    localStorage.setItem("opened", "balance.html")

    // Define variable to set placeholder if user chooses mainnet or testnet
    var inputPlaceholder = $("#addressInput")

    // Set the address in the input so that it gets balance
    $("#addressInput").val(address)

    $("#token-list").addClass("hidden")

    inputPlaceholder.attr("placeholder", "Kdc...")

    // Sets history tab to open to explorer
    setHref(address)

    $("#balanceAok").addClass('active')

    setLang("balance")

    var length = 0

    function getBalance() {
        $("#currentBalance").text("Loading...")
        apiCall("balance", {
            "address": $("#addressInput").val()
        }).then((data) => {
            var balance = data.result.balance / 100000000
            $("#currentBalance").text(balance + " " + prefix)

            if (data.result.tokens.length != 0) {
                $("#token-list").removeClass("hidden").addClass("show")
                $("#noToken").removeClass("show").addClass("hidden")
                for (var i = 0; i < data.result.tokens.length; i++) {
                    var token_length = data.result.tokens.length
                    var token = data.result.tokens[i]
                    var tbody = $("#token-body")
                    var markup = "<tr><td>" + token.tokenName + "</td><td>" + tokenBalance(token.balance, token.units) + "</td></tr>"
                    if (length != token_length) {
                        length = token_length
                        tbody.append(markup)
                    }
                }
            }
            else {
                $("#token-list").removeClass("show").addClass("hidden")
                $("#noToken").removeClass("hidden").addClass("show")
            }
        })
    }
    
    setInterval(() => {
        apiCall("balance", {
            "address": $("#addressInput").val()
        }).then((data) => {
            if (data.error == null) {
                getBalance()
                qrcodegen()
            }
            else {
                $("#currentBalance").text("Enter a valid AokChain address")
                $("#token-list").removeClass("show").addClass("hidden")
                $("#noToken").removeClass("hidden").addClass("show")
            }
        })
    }, 5000)

    getBalance()
    qrcodegen()
}

$("#addressInput").on("keydown", function(e) {
    if (e.keyCode == 13) {
        qrcodegen()
    }
})

// Generate QR code
function qrcodegen() {
    // Define variable to set QR Code
    var aokqrcode = new QRCode(document.getElementById("aokqr"), {
        width: 100,
        height: 100,
        position: "center"
    })

    if (!document.getElementById("addressInput").value) {
        aokqrcode.makeCode("Enter an address")
    }
    else {
        aokqrcode.makeCode(document.getElementById("addressInput").value)
    }
}
