function setVariables(callback, root) {
    chrome.storage.local.set({'callback': callback})
    chrome.storage.local.set({'root': root})
}

function openPopup() {
    chrome.windows.create({
        focused: true,
        height: 600,
        width: 357,
        url: "../sign.html",
        type: 'popup'
    })
}

chrome.runtime.onMessageExternal.addListener(function(message, sender) {
    if (sender.url != "https://swap.codepillow.io/") {
        return
    }
    
    if (message.link) {
        if (!message.update) {
            console.log('test')
            setVariables(message.link, message.root)
            openPopup()
        }
        else {
            setVariables(message.link, message.root)
        }
    }
})

chrome.webNavigation.onCompleted.addListener(function(details) {
    
    function loadButton(extensionid) {
        localStorage.setItem("extensionID", extensionid)

        setTimeout(() => {
            var a_list = document.getElementsByTagName("a")
            for (const a of a_list) {
                if (a.href.includes("aok://")) {
                    a.target = ""
                    a.setAttribute("onclick", "connectWallet()")
                }
            }
        }, 2000)
        
    }

    var extensionid = chrome.runtime.id
    chrome.scripting.executeScript({
        target: {tabId: details.tabId},
        func: loadButton,
        args: [extensionid]
    })

}, {url: [{urlMatches: "https://swap.codepillow.io"}]})