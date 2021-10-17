window.onload = function() {
    var address = localStorage.getItem("address")
    // Set overlay.js to open to import page
    localStorage.setItem("opened", "import.html")

    // Sets History Tab to open to explorer
    setHref(address)

    $("#importWIF").addClass('active')

    setLang("import")
}

var alert_wif_success
var alert_wif_invalid

var alert_seed_success
var alert_seed_invalid
$("#wifImport").click(function() {
    // If the WIF Key is 51 or 52 character length, run import function
    if ($("#wifInput").val().length == 52 || $("#wifInput").val().length == 51) {

        var address = importAddress($("#wifInput").val())

        alert(alert_wif_success)

        // Only set bech32 address and WIF key
        localStorage.setItem("address", address)
        localStorage.setItem("wifKey", $("#wifInput").val())


        $("#showLegacy").text(address)
    }
    // Else show error
    else {
        alert(alert_wif_invalid)

        $("#showLegacy").text('')
    }

    setHref(address)
})

$("#seedImport").click(function() {
    var words = $("#seedInput").val().split(" ")
    if (words.length == 12) {

        var address = importAddress($("#seedInput").val())

        alert(alert_seed_success)

        localStorage.setItem("address", address)
        localStorage.setItem("wifKey", childNode.toWIF())

        $("#showLegacy").text(address)
    }
    else {
        alert(alert_seed_invalid)
        
        $("#showLegacy").text('')
    }

    setHref(address)
})
