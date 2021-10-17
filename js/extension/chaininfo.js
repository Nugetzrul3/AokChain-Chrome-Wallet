window.onload = function (){
    var getaddress = localStorage.getItem("address")
    // Set overlay.js to open to chain info page
    localStorage.setItem("opened", "chaininfo.html")

    // Set history page to open to explorer
    var href = "https://explorer.aok.network/#/address/" + getaddress

    $("#history").attr("href", href)

    setLang("chaininfo")

    function getBlockHeight() {
        apiCall("/info").then((data) => {
            var height = data.result.blocks
            $("#blockHeight").text(height)
        })
    }

    function getNetHash() {
        apiCall("/info").then((data) => {
            var gethash = data.result.nethash
            $("#netHashrate").text(formatHash(gethash))
        })
    }

    function getSupply() {
        apiCall("/supply").then((data) => {
            var getsupply = data.result.supply
            var supply = getsupply / 100000000
            $("#circSupply").text(supply + " " + prefix)
        })
    }

    // Loop functions to continuously show chain info
    setInterval(function() {
        getBlockHeight()
        getNetHash()
        getSupply()
    }, 3000)
    
}
