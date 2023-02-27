const Discord = require("../src/exports.js");

// No parameters
const factory = new Discord.AccountFactory();

factory.createAccount(
    "username", // Account username
    "xxx.xxx.xxx.xxx:xxx", // Proxy to make the requests with. Should look like "http://123.123.123:123"
    // Captcha solve callback
    async (captchaInfo) => {
        // captchaInfo properties:
        //  .service
        //  .siteKey
        //  .siteURL
        //  .error

        return "key"; // Expects a real captcha key as a return value
    }
);
