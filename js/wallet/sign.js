var callback_link
var message
window.onload = () => {
    chrome.storage.local.get(['callback', 'root'], (result) => {
        Promise.resolve($.ajax({
            url: result.root + "/app.json",
            method: "GET"
        })).then((data) => {
            if (data.icon) {
                $("#name").text(data.name)
                $("#icon").attr("src", data.icon)
            }
        })
        var url = new urlparse(result.callback)
        var link = new URLSearchParams(url.query)
        callback_link = link.get("callback")
        message = link.get('message')
        $("#message").text(message)  
    })
}

setInterval(() => {
    chrome.storage.local.get(['callback'], (result) => {
        var url = new urlparse(result.callback)
        var link = new URLSearchParams(url.query)
        callback_link = link.get("callback")
        message = link.get('message')
        $("#message").text(message)
    })
}, 1000)

var wifKey = bitcoin.ECPair.fromWIF(localStorage.getItem("wifKey"), netconfig['network'])

$("#sign").click(function() {
    var signature = bitcoin.message.sign(message, wifKey.privateKey, wifKey.compressed, "\x14AOK Signed Message:\n")
    sendCallback(callback_link, localStorage.getItem("address"), signature.toString("base64"))
    .then((data) => {
        console.log(data)
    })
})

$("#decline").click(function() {
    window.close()
})

async function sendCallback(callback, address, signature) {
    const response = await fetch(callback, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"address":address, "signature":signature})
    })
    const data = await response.json()
    return data
}