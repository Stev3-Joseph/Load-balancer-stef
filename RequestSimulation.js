const URL = "http://localhost:8080/o"

const REQUESTS_PER_TEST =20;

const intervals =[500, 450, 400, 350, 300, 250, 200, 150, 100, 50, 30, 20, 15, 10, 5, 1]

const sleep = (ms) => new Promise ((resolve) =>
    setTimeout(resolve,ms));

async function sendRequest() {
    try {
        const response = await fetch(URL);
        const body = await response.text();

        let status = "failure";

        if (response.ok && body.includes("ACCESS GRANTED")) {
            status = "success";
        }

        return {
            status: status,
            message: body
        };

    } catch (error) {
        return {
            status: "failure",
            message: error.message
        };
    }
}

async function runTest(interval)
{
    let success =0;
    let failure=0;

    console.log(`\n Testing ${REQUESTS_PER_TEST} requests at ${interval} ms intervals`)

    const starttime =Date.now();

    const requests=[];

    for (let i = 0 ;i <REQUESTS_PER_TEST;i++)
    {
        requests.push(sendRequest())
        if (i < REQUESTS_PER_TEST -1)
        {
            await sleep(interval);
        }

    }
    const results = await Promise.all(requests);

    for (const result of results) {
        if (result.status === "success") {
            success++;
        } else {
            failure++;
        }

        console.log(`[${result.status.toUpperCase()}] ${result.message}`);
    }
    const total = success + failure;
    const successRate = ( success / total )*100;
    const failureRate = ( failure / total )*100;
    const duration = ((Date.now()-starttime)/1000).toFixed(2);

    const summary = {
        interval,
        total,
        success,
        failure,
        successRate: successRate.toFixed(2),
        failureRate: failureRate.toFixed(2),
        duration
    };

    console.log("\n--- Test Results ---");
    console.log(`Interval:      ${summary.interval} ms`);
    console.log(`Total Requests: ${summary.total}`);
    console.log(`Successful:     ${summary.success}`);
    console.log(`Failed:         ${summary.failure}`);
    console.log(`Success Rate:   ${summary.successRate}%`);
    console.log(`Failure Rate:   ${summary.failureRate}%`);
    console.log(`Duration:       ${summary.duration} seconds`);

    return summary;


}

async function main()
{
    const results =[];
    for (const interval of intervals)
    {
        results.push(await(runTest(interval)))
    }
    console.table(results);
}

main().catch(console.error)
