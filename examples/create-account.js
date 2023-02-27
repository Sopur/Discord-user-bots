const Discord = require("discord-user-bots");

// captcha.guru is a capcha solving service.
// This is a wrapper I made for it.
// `npm i captchaguru` to install
const Guru = require("captchaguru");
const factory = new Discord.AccountFactory();

// Config
const proxy = "xxx.xxx.xxx.xxx:xxx";
const proxyType = "HTTP";
const accountName = "discord-user-bots account!";

// Solve captcha callback
async function solveCaptcha(captchaInfo) {
    const solver = new Guru("captcha.guru API token goes here.", captchaInfo.service, captchaInfo.siteKey, captchaInfo.siteURL, proxy, proxyType);
    return solver.solve();
}

void (async function main() {
    // Returns token on success
    const token = await factory.createAccount(accountName, solveCaptcha, `${proxyType.toLowerCase()}://${proxy}`);
    console.log("Created account: ", token);

    // Attempt to login to the newly created account
    const client = new Discord.Client(token);
    client.on.ready = function () {
        console.log("Created account online!");
    };
})();
