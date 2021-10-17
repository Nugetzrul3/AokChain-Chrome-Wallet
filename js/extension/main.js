var alertmsg
window.onload = function() {
    var address = localStorage.getItem("address")

    localStorage.setItem("opened", "main.html")

    $("#addressDisplay").text(address)

    // Sets History Tab to open to explorer
    setHref(address)

    setLang("main")

    console.log(urlparse)

}

$("#generateAddress").click(function() {

    var address, key = generateAddress()

    $("#addressDisplay").text(address)

    localStorage.setItem("address", address)
    localStorage.setItem("wifKey", key)

    // WIF key only showed once for security purposes
    $("#wifDisplay").text(childNode.toWIF())
    $("#seedDisplay").text(mnemonic)

    alert(alertmsg)

    // Sets History Tab to open to explorer
    setHref(address)
})