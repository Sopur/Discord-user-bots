const config = {
    sleep: 10,
    max_requests: 20,
    log_time: 100,
};

async function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

async function click() {
    const res = await fetch("https://obscurebutton.com/api/clicks", {
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ increment: 10 }),
        method: "POST",
    });

    try {
        return (await res.json()).count;
    } catch (e) {
        return 0;
    }
}

void (async function main() {
    let countOld = 0;
    let countNew = 0;
    let activeReqs = 0;

    setInterval(() => {
        console.log(
            `[${activeReqs}] ${countOld} (${((countNew - countOld) / config.log_time) * 1000}/sec)`
        );
        countOld = countNew;
    }, config.log_time);

    setInterval(async () => {
        if (activeReqs >= config.max_requests) return;
        activeReqs++;
        countNew = (await click()) || countNew;
        activeReqs--;
    }, config.sleep);
})();
