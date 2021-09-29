window.onload = function() {
    var getaddress = localStorage.getItem("address")
    // Set overlay.js to open to import page
    localStorage.setItem("opened", "import.html")

    setImportLang()

    // Sets History Tab to open to explorer
    var href = "https://explorer.aok.network/#/address/" + getaddress

    $("#history").attr("href", href)

    $("#importWIF").addClass('active')
}

var netconfig = {
    'network': {
        'messagePrefix': '\x19AokChain Signed Message:\n',
        'bip32': {
            'public': 0x0488B21E,
            'private': 0x0488ADE4
        },
        'pubKeyHash': 0x2E,
        'scriptHash': 0x6C,
        'wif': 0xFF
    }
}

var alert_wif_success
var alert_wif_invalid

var alert_seed_success
var alert_seed_invalid
$("#wifImport").click(function() {
    // If the WIF Key is 51 or 52 character length, run import function
    if ($("#wifInput").val().length == 52 || $("#wifInput").val().length == 51) {

        // Get WIF from the user input
        var wifInput = $("#wifInput").val()

        var wifKey = bitcoin.ECPair.fromWIF(wifInput, netconfig['network'])
    
        var legacyadd = bitcoin.payments.p2pkh({'pubkey': wifKey.publicKey, 'network': netconfig['network']}).address

        alert(alert_wif_success)

        // Only set bech32 address and WIF key
        localStorage.setItem("address", legacyadd)
        localStorage.setItem("wifKey", $("#wifInput").val())
    
        $("#showLegacy").text(legacyadd)
    }
    // Else show error
    else {
        alert(alert_wif_invalid)

        $("#showLegacy").text('')
    }

    var getaddress = localStorage.getItem("address")

    var href = "https://explorer.aok.network/#/address/" + getaddress

    $("#history").attr("href", href)
})

var path = "m/44'/0'/0'/"

$("#seedImport").click(function() {
    var words = $("#seedInput").val().split(" ")
    if (words.length == 12) {
        var seedInput = $("#seedInput").val()
        var seed = bip39.mnemonicToSeedSync(seedInput)
        var hdMaster = bitcoin.bip32.fromSeed(seed, netconfig['network'])
        var childNode = hdMaster.derivePath(`${path}0`).derive(0)

        var address = bitcoin.payments.p2pkh({'pubkey': childNode.publicKey, 'network': netconfig['network']}).address

        alert(alert_seed_success)

        localStorage.setItem("address", address)
        localStorage.setItem("wifKey", childNode.toWIF())

        $("#showLegacy").text(address)
    }
    else {
        alert(alert_seed_invalid)
        
        $("#showLegacy").text('')
    }

    var getaddress = localStorage.getItem("address")

    var href = "https://explorer.aok.network/#/address/" + getaddress

    $("#history").attr("href", href)
})

var lang = {
    'en': {
        // Page text
        'wifImport': "Import WIF",
        'seedImport': "Import Seed",
        'legacy': "Legacy address:",
        'alert_wif_success': "WIF Imported Successfully",
        "alert_wif_invalid": "WIF Invalid",
        'alert_seed_success': "Seed Imported Successfully",
        "alert_seed_invalid": "Seed is invalid",
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
        'wifImport': "Importer WIF",
        'seedImport': "Importer Seed",
        'legacy': "Legacy Adresse:",
        'alert_wif_success': "WIF Importé Succès",
        "alert_wif_invalid": "WIF invalide",
        'alert_seed_success': "Semences importées avec succès",
        "alert_seed_invalid": "La graine est invalide",
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
        'wifImport': "수입 WIF",
        'seedImport': "수입 Seed",
        'legacy': "Legacy 주소를:",
        'alert_wif_success': "WIF 수입품 성공적으로",
        "alert_wif_invalid": "WIF 무효로 하는",
        'alert_seed_success': "종자를 성공적으로 가져왔습니다",
        "alert_seed_invalid": "시드가 잘못되었습니다",
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
        'wifImport': "Impor WIF",
        'seedImport': "Impor Seed",
        'legacy': "Legacy Alamat:",
        'alert_wif_success': "WIF yg diimpor Berhasil",
        "alert_wif_invalid": "WIF batal",
        'alert_seed_success': "Benih Berhasil Diimpor",
        "alert_seed_invalid": "Benih tidak valid",
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
        'wifImport': "Importar WIF",
        'seedImport': "Importar Seed",
        'legacy': "Legacy Alocución:",
        'alert_wif_success': "WIF Importado Exitosamente",
        "alert_wif_invalid": "WIF inválido",
        'alert_seed_success': "Semilla importada con éxito",
        "alert_seed_invalid": "La semilla no es válida",
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
        'wifImport': "Импортиране на WIF",
        'seedImport': "Импортиране на Seed",
        'legacy': "Legacy адрес:",
        'alert_wif_success': "WIF ключ успешно импортирован",
        "alert_wif_invalid": "Недействительный WIF",
        'alert_seed_success': "Семена успешно импортированы",
        "alert_seed_invalid": "Семя недействительно",
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
        'wifImport': "导入 WIF",
        'seedImport': "导入 Seed",
        'legacy': "Legacy地址:",
        'alert_wif_success': "导入WIF地址成功",
        "alert_wif_invalid": "无效的WIF",
        'alert_seed_success': "种子导入成功",
        "alert_seed_invalid": "种子无效",
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
        'tx-history': "历史",
        'chain-info': "网络信息",
        'settings': "设置"
    },

    'ja': {
        // Page text
        'wifImport': "インポート WIF",
        'seedImport': "インポート Seed",
        'legacy': "Legacy 住所:",
        'alert_wif_success': "WIF 舶来 成功した",
        "alert_wif_invalid": "WIF 病弱な",
        'alert_seed_success': "シードが正常にインポートされました",
        "alert_seed_invalid": "シードが無効です",
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

function setImportLang() {
    if (localStorage['lang'] == null) {
        // Page text
        $("#legacy").text(lang['en']['legacy'])
        $("#wifImport").text(lang['en']['wifImport'])
        $("#seedImport").text(lang['en']['seedImport'])
        $("#import-wif").text(lang['en']['wifImport'])
        $("#import-seed").text(lang['en']['seedImport'])
        $("#part1").text(lang['en']['logoutreminder']['part1'])
        $("#logoutlink").text(lang['en']['logoutreminder']['logoutlink'])
        $("#part2").text(lang['en']['logoutreminder']['part2'])
        alert_wif_success = lang['en']['alert_wif_success']
        alert_wif_invalid = lang['en']['alert_wif_invalid']
        alert_seed_success = lang['en']['alert_seed_success']
        alert_seed_invalid = lang['en']['alert_seed_invalid']

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
        $("#legacy").text(lang[localStorage.getItem("lang")]['legacy'])
        $("#wifImport").text(lang[localStorage.getItem("lang")]['wifImport'])
        $("#seedImport").text(lang[localStorage.getItem("lang")]['seedImport'])
        $("#import-wif").text(lang[localStorage.getItem("lang")]['wifImport'])
        $("#import-seed").text(lang[localStorage.getItem("lang")]['seedImport'])
        $("#part1").text(lang[localStorage.getItem("lang")]['logoutreminder']['part1'])
        $("#logoutlink").text(lang[localStorage.getItem("lang")]['logoutreminder']['logoutlink'])
        $("#part2").text(lang[localStorage.getItem("lang")]['logoutreminder']['part2'])
        alert_wif_success = lang[localStorage.getItem("lang")]['alert_wif_success']
        alert_wif_invalid = lang[localStorage.getItem("lang")]['alert_wif_invalid']
        alert_seed_success = lang[localStorage.getItem("lang")]['alert_seed_success']
        alert_seed_invalid = lang[localStorage.getItem("lang")]['alert_seed_invalid']

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
