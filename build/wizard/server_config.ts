
const localdev = process.env.LOCALDEV || false;


const server_config = {
    monitor_url: "https://stader.my.ava.do:9999"
    // monitor_url: localdev ? "http://localhost:9999" : "https://stader.my.ava.do:9999"
}
if (localdev) {
    console.log("==> Development mode");
    console.log(server_config);
}

export { server_config };