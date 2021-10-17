var link = ""
var interval

window.onload = () => {
    if (interval) {
        clearInterval(interval)
    }
}

function connectWallet() {
        
    var array = [];
    var links = document.getElementsByTagName('a');
    for(var i=0; i<links.length; i++) {
        array.push(links[i].href);
    }

    for (var i=0; i < array.length; i++) {
        if (array[i].includes('aok://')) {
            link = array[i]
        }
    }

    chrome.runtime.sendMessage(localStorage.getItem("extensionID"), {link: link, root: window.location.origin})
    if (interval == undefined) {
        interval = setInterval(() => {
            var array = [];
            var links = document.getElementsByTagName("a");
            for(var i=0; i<links.length; i++) {
                array.push(links[i].href);
            }
        
            for (var i=0; i < array.length; i++) {
                if (array[i].includes('aok://')) {
                    link = array[i]
                }
            }
    
            chrome.runtime.sendMessage(localStorage.getItem("extensionID"), {link: link, root: window.location.origin, update: true})
        }, 1000)
    }
}
