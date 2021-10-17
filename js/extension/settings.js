window.onload = function() {
    var address = localStorage.getItem("address")
    
    // Sets overlay.html to open to settings page
    localStorage.setItem("opened", "settings.html")

    setSettingsLang()

    // Sets history tab to open to explorer
    setHref(address)

}

// Clear Local Storage (WIF, Address, reset overlay.html and reset endpoint)
$("#logoutButton").click(function (){
    localStorage.removeItem("wifKey")
    localStorage.removeItem("address")
    localStorage.removeItem("opened")
    // Default back to mainnet api
    localStorage.removeItem("api")
    localStorage.setItem("apiSet", "mainnet")
})

// Set mutli-lang
function setSettingsLang() {
    var langset = document.getElementById("languageSelect")
    langset.onchange = function () {
        localStorage.setItem("lang", this.value)
        document.location.reload()
    }

    if (localStorage['lang'] == null) {
        // Page text
        $("#langlabel").text(lang['en']['langlabel'])
        $("#endpointLabel").text(lang['en']['endpointlabel'])
        $("#logoutButton").text(lang['en']['logouttext'])
        $("#license1").text(lang['en']['license'])

        // Tab text
        $("#create-wallet").text(lang['en']['create-wallet'])
        $("#import-wallet").text(lang['en']['import-wallet'])
        $("#your-wallet").text(lang['en']['your-wallet'])
        $("#send").text(lang['en']['send'])
        $("#tx-history").text(lang['en']['tx-history'])
        $("#chain-info").text(lang['en']['chain-info'])
        $("#settings").text(lang['en']['settings'])
        langset.value = 'en'
    }
    else {
        // Page text
        $("#langlabel").text(lang[localStorage.getItem("lang")]['langlabel'])
        $("#endpointLabel").text(lang[localStorage.getItem("lang")]['endpointlabel'])
        $("#logoutButton").text(lang[localStorage.getItem("lang")]['logouttext'])
        $("#license1").text(lang[localStorage.getItem("lang")]['license'])

        // Tab text
        $("#create-wallet").text(lang[localStorage.getItem("lang")]['create-wallet'])
        $("#import-wallet").text(lang[localStorage.getItem("lang")]['import-wallet'])
        $("#your-wallet").text(lang[localStorage.getItem("lang")]['your-wallet'])
        $("#send").text(lang[localStorage.getItem("lang")]['send'])
        $("#tx-history").text(lang[localStorage.getItem("lang")]['tx-history'])
        $("#chain-info").text(lang[localStorage.getItem("lang")]['chain-info'])
        $("#settings").text(lang[localStorage.getItem("lang")]['settings'])
        langset.value = localStorage.getItem("lang")
    }
}