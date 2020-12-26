var getaddress
var api
var prefix

// Define variable to set QR Code
var sugarqrcode = new QRCode(document.getElementById("sugarqr"), {
    width: 100,
    height: 100,
    position: "center"
})

window.onload = function (){
    // Get address from local storage
    getaddress = localStorage.getItem("address")

    // Set overlay.js to open to balance page
    localStorage.setItem("opened", "balance.html")

    // Define variable to set placeholder if user chooses mainnet or testnet
    var inputPlaceholder = $("#addressInput")

    // Set the address in the input so that it gets balance
    $("#addressInput").val(getaddress)

    $("#token-list").addClass("hidden")
    
    apiget = localStorage.getItem("apiSet")

    inputPlaceholder.attr("placeholder", "Kdc...")
    prefix = "AOK"

    api = "https://api.aok.network"

    // Sets history tab to open to explorer
    var href = "https://explorer.aok.network/#/address/" + getaddress

    $("#history").attr("href", href)

    $("#balanceAok").addClass('active')

    // Define function to make api get request
    function apiCall() {
        return Promise.resolve($.ajax({
            url: api + "/balance/" + $("#addressInput").val(),
            dataType: 'json',
            type: 'GET'
        }))
    }

    var length = 0

    function getBalance() {
        $("#currentBalance").text("loading...")
        apiCall().then(function(data) {
            var getbalance = data.result.balance
            var balance = getbalance / 100000000
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

    function checkAPI() {
        apiCall().then(function(data) {
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
    }

    // Set loop to continuously update balance 
    setInterval(function() {
        checkAPI()
    }, 5000)

    setWalletInfoLang()
    getBalance()
    qrcodegen()
}

// Generate QR code
function qrcodegen() {
    if (!document.getElementById("addressInput").value) {
        sugarqrcode.makeCode("Enter an address")
    }
    else {
        sugarqrcode.makeCode(document.getElementById("addressInput").value)
    }
}

$("#addressInput").on("keydown", function(e) {
    if (e.keyCode == 13) {
        qrcodegen()
    }
})

function tokenBalance(amount, units) {
    return amount / 10 ** units
}

// Multi Lang
var lang = {
    'en': {
        // Page text
        'current-balance': "Current Balance:",
        'logoutreminder': {
            'part1': "Remember to",
            'logoutlink': "Logout",
            'part2': "before exiting Chrome",
        },

        // Tab text
        'create-wallet': "Create Wallet",
        'import-wallet': "Import Wallet",
        'your-wallet': "Your Wallet",
        'send': "Send",
        'tx-history': "History",
        'chain-info': "Chain Info",
        'settings': "Settings"
    },
    

    'fr': {
        // Page text
        'current-balance': "Existant équilibre:",
        'logoutreminder': {
            'part1': "Se souvenir de",
            'logoutlink': "Se Déconnecter",
            'part2': "avant de sortir Chrome",
        },

        // Tab text
        'create-wallet': "Créer Portefeuille",
        'import-wallet': "Importer Portefeuille",
        'your-wallet': "Votre Portefeuille",
        'send': "Envoyer",
        'tx-history': "L'histoire",
        'chain-info': "Chaîne Données",
        'settings': "Paramètres"        
    },

    'kr': {
        // Page text
        'current-balance': "흘림글씨의 밸런스:",
        'logoutreminder': {
            'part1': "기억해",
            'logoutlink': "로그 아웃",
            'part2': "종료하기 전에",
        },

        // Tab text
        'create-wallet': "창조하다 지갑",
        'import-wallet': "수입 지갑",
        'your-wallet': "너의 지갑",
        'send': "보내다",
        'tx-history': "역사",
        'chain-info': "체인 정보",
        'settings': "설정"
    },

    'id': {
        // Page text
        'current-balance': "Saldo Sekarang:",
        'logoutreminder': {
            'part1': "Ingat untuk",
            'logoutlink': "Keluar",
            'part2': "sebelum keluar Chrome",
        },

        // Tab text
        'create-wallet': "Membuat Dompet",
        'import-wallet': "Impor Dompet",
        'your-wallet': "Dompet Anda",
        'send': "Kirim",
        'tx-history': "Riwayat",
        'chain-info': "Data Rantai",
        'settings': "Pengaturan"
    },

    'es': {
        // Page text
        'current-balance': "Presente Saldo:",
        'logoutreminder': {
            'part1': "Recuerda a",
            'logoutlink': "Cerrar sesión",
            'part2': "antes de irse Chrome",
        },

        // Tab text
        'create-wallet': "Billetera Crear",
        'import-wallet': "Billetera Importar",
        'your-wallet': "Billetera Tu",
        'send': "Enviar",
        'tx-history': "Historia",
        'chain-info': "Informacion Red",
        'settings': "El Ajuste"
    },

    'ru': {
        // Page text
        'current-balance': "современный Баланс:",
        'logoutreminder': {
            'part1': "Помните в",
            'logoutlink': "Выйти",
            'part2': "перед выходом",
        },

        // Tab text
        'create-wallet': "Создать кошелек",
        'import-wallet': "Импорт кошелька",
        'your-wallet': "Ваш кошелек",
        'send': "Отправить",
        'tx-history': "История",
        'chain-info': "Информация о сети",
        'settings': "Настройки"
    },

    'zh': {
        // Page text
        'current-balance': "当前余额:",
        'logoutreminder': {
            'part1': "记得 至",
            'logoutlink': "登出",
            'part2': "退出前 Chrome",
        },

        // Tab text
        'create-wallet': "创建钱包",
        'import-wallet': "导入钱包",
        'your-wallet': "你的钱包",
        'send': "发送",
        'tx-history': "历史信息",
        'chain-info': "网络信息",
        'settings': "设置"
    },

    'ja': {
        // Page text
        'current-balance': "電流 残高:",
        'logoutreminder': {
            'part1': "覚えて に",
            'logoutlink': "ログアウト",
            'part2': "出る前に Chrome",
        },

        // Tab text
        'create-wallet': "作成する 財布",
        'import-wallet': "インポート 財布",
        'your-wallet': "きみの 財布",
        'send': "送る",
        'tx-history': "歴史",
        'chain-info': "通信網 情報",
        'settings': "設定"
    },
}

function setWalletInfoLang() {
    if (localStorage['lang'] == null) {
        // Page text
        $("#current-balance").text(lang['en']['current-balance'])
        $("#part1").text(lang['en']['logoutreminder']['part1'])
        $("#logoutlink").text(lang['en']['logoutreminder']['logoutlink'])
        $("#part2").text(lang['en']['logoutreminder']['part2'])

        // Tab text
        $("#create-wallet").text(lang['en']['create-wallet'])
        $("#import-wallet").text(lang['en']['import-wallet'])
        $("#your-wallet").text(lang['en']['your-wallet'])
        $("#send").text(lang['en']['send'])
        $("#tx-history").text(lang['en']['tx-history'])
        $("#chain-info").text(lang['en']['chain-info'])
        $("#settings").text(lang['en']['settings'])
    }
    else {
        // Page text
        $("#current-balance").text(lang[localStorage.getItem("lang")]['current-balance'])
        $("#part1").text(lang[localStorage.getItem("lang")]['logoutreminder']['part1'])
        $("#logoutlink").text(lang[localStorage.getItem("lang")]['logoutreminder']['logoutlink'])
        $("#part2").text(lang[localStorage.getItem("lang")]['logoutreminder']['part2'])

        // Tab text
        $("#create-wallet").text(lang[localStorage.getItem("lang")]['create-wallet'])
        $("#import-wallet").text(lang[localStorage.getItem("lang")]['import-wallet'])
        $("#your-wallet").text(lang[localStorage.getItem("lang")]['your-wallet'])
        $("#send").text(lang[localStorage.getItem("lang")]['send'])
        $("#tx-history").text(lang[localStorage.getItem("lang")]['tx-history'])
        $("#chain-info").text(lang[localStorage.getItem("lang")]['chain-info'])
        $("#settings").text(lang[localStorage.getItem("lang")]['settings'])
    }
}
