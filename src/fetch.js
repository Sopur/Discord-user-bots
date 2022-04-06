if (typeof fetch === "undefined") {
    console.log(
        '[WARN] (DISCORD-USER-BOTS) ==> FALLING BACK TO NODE-FETCH. Your Node version doesn\'t support native fetches which may disable some features. If using Node 17.* use the "--experimental-fetch" flag. Otherwise, please upgrade to Node 18.0.'
    );
    module.exports = require("node-fetch");
} else {
    module.exports = fetch;
}
