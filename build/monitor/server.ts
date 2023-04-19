import * as restify from "restify";
import corsMiddleware from "restify-cors-middleware2"
import { SupervisorCtl } from "./SupervisorCtl";
import { server_config } from "./server_config";
import { rest_url, validatorAPI, getAvadoPackageName, getTokenPathInContainer, getAvadoExecutionClientPackageName, client_url } from "./urls";
import { DappManagerHelper } from "./DappManagerHelper";
import { readFileSync } from "fs";
import AdmZip from 'adm-zip';


const autobahn = require('autobahn');
const exec = require("child_process").exec;
const fs = require('fs');
const jsonfile = require('jsonfile')

const supported_beacon_chain_clients = ["prysm", "teku"];
const supported_execution_clients = ["geth", "nethermind"];

console.log("Monitor starting...");

const server = restify.createServer({
    ...server_config.https_options,
    name: "MONITOR",
    version: "1.0.0"
});

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: [
        /^http:\/\/localhost(:[\d]+)?$/,
        "http://*.my.ava.do"
    ]
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

server.get("/ping", (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.send(200, "pong");
    next()
});

server.get("/network", (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.send(200, server_config.network);
    next()
});

server.get("/name", (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.send(200, server_config.name);
    next()
});

const supervisorCtl = new SupervisorCtl(`localhost`, 5555, '/RPC2') || null;

const restart = async () => {
    await Promise.all([
        supervisorCtl.callMethod('supervisor.stopProcess', ["stader-node", true]),
    ])
    return Promise.all([
        supervisorCtl.callMethod('supervisor.startProcess', ["stader-node", true]),
    ])
}

server.post("/service/restart", (req: restify.Request, res: restify.Response, next: restify.Next) => {
    restart().then((result) => {
        res.send(200, "restarted");
        return next()
    }).catch((error) => {
        res.send(500, "failed")
        return next();
    })
});

server.post("/service/stop", (req: restify.Request, res: restify.Response, next: restify.Next) => {
    const method = 'supervisor.stopProcess'
    Promise.all([
        supervisorCtl.callMethod(method, ["stader-node"]),
    ]).then(result => {
        res.send(200, "stopped");
        next()
    }).catch(err => {
        res.send(200, "failed")
        next();
    })
});

server.post("/service/start", (req: restify.Request, res: restify.Response, next: restify.Next) => {
    const method = 'supervisor.startProcess'
    Promise.all([
        supervisorCtl.callMethod(method, ["stader-node"]),
    ]).then(result => {
        res.send(200, "started");
        next()
    }).catch(err => {
        res.send(200, "failed")
        next();
    })
});

server.get("/service/status", (req: restify.Request, res: restify.Response, next: restify.Next) => {
    const method = 'supervisor.getAllProcessInfo'
    supervisorCtl.callMethod(method, [])
        .then((value: any) => {
            res.send(200, value);
            next()
        }).catch((_error: any) => {
            res.send(500, "failed")
            next();
        });
});

let wampSession: any = null;
{
    const url = "ws://wamp.my.ava.do:8080/ws";
    const realm = "dappnode_admin";

    const connection = new autobahn.Connection({ url, realm });
    connection.onopen = (session: any) => {
        console.log("CONNECTED to \nurl: " + url + " \nrealm: " + realm);
        wampSession = session;
    };
    connection.open();
}

const getInstalledClients = async () => {
    const dappManagerHelper = new DappManagerHelper(server_config.packageName, wampSession);
    const packages = await dappManagerHelper.getPackages();

    const installed_clients = supported_beacon_chain_clients
        .filter(client => (packages.includes(getAvadoPackageName(client, "beaconchain"))
            && packages.includes(getAvadoPackageName(client, "validator")))
        )
        .map(client => ({
            name: client,
            url: `http://${client_url(client)}`
        }))
    return installed_clients;
}

server.get("/bc-clients", async (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.send(200, await getInstalledClients())
    next();
})

server.get("/ec-clients", async (req: restify.Request, res: restify.Response, next: restify.Next) => {
    const dappManagerHelper = new DappManagerHelper(server_config.packageName, wampSession);
    const packages = await dappManagerHelper.getPackages();

    const installed_clients = supported_execution_clients.filter(client => packages.includes(getAvadoExecutionClientPackageName(client)));

    res.send(200, installed_clients.map(client => ({
        name: client,
        api: rest_url(client),
        url: `http://${client_url(client)}`
    })))
    next();
})


server.post("/stader-api", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        staderApiCommand(req.body.command).then((stdout) => {
            res.send(200, stdout);
            return next();
        }).catch((e) => {
            res.send(500, e);
            return next();
        })
    }
});

const staderApiCommand = (command: string) => {
    const cmd = `/go/bin/stader api ${command}`;
    console.log(`Running ${cmd}`);

    const executionPromise = execute(cmd);

    executionPromise.then((result) => {
        const data = JSON.parse(result);
        if (command.includes("wallet init") && "mnemonic" in data) {
            // store mnemonic to file
            fs.writeFile("/.stader/mnemonic", data.mnemonic, (err: any) => console.log(err ? err : "Saved mnemoic"));
        }
        if ("txHash" in data) {
            storeTxHash(data.txHash);
        }
    })

    return executionPromise;
}

const execute = (cmd: string) => {
    return new Promise<string>((resolve, reject) => {
        const child = exec(cmd, (error: Error, stdout: string | Buffer, stderr: string | Buffer) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return reject(error.message);
            }
            if (stderr) {
                console.log(`error: ${stderr}`);
                return reject(stderr);
            }
            return resolve(stdout.toString());

        });
        child.stdout.on('data', (data: any) => console.log(data.toString()));
    });
}

const storeTxHash = (txHash: string) => {
    const transactionsFile = "/.stader/transactions.json";
    console.log(`Store hash ${txHash} to ${transactionsFile}`);
    try {
        const data = (fs.existsSync(transactionsFile)) ? jsonfile.readFileSync(transactionsFile) : { transactions: [] };
        data.transactions.push(txHash);
        jsonfile.writeFileSync(transactionsFile, data);
    } catch (e) {
        console.error(e)
    }
}


//backup
const backupFileName = "stader-backup.zip";
server.get("/" + backupFileName, (req: restify.Request, res: restify.Response, next: restify.Next) => {
    res.setHeader("Content-Disposition", "attachment; " + backupFileName);
    res.setHeader("Content-Type", "application/zip");

    const zip = new AdmZip();
    zip.addLocalFolder("/.stader/", ".stader");
    zip.toBuffer(
        (buffer: Buffer) => {
            res.setHeader("Content-Length", buffer.length);
            res.end(buffer, "binary");
            next();
        }
    )

});

// //restore
// server.post('/restore-backup', (req, res, next) => {
//     console.log("upload backup zip file");
//     if (req.files.file) {
//         const file = req.files.file;
//         req.info = file.name;
//         const zipfilePath = "/tmp/" + file.name;
//         fs.renameSync(file.path, zipfilePath, (err) => { if (err) console.log('ERROR: ' + err) });
//         console.log("received backup file " + file.name);
//         try {
//             validateZipFile(zipfilePath);

//             // delete existing data folder (if it exists)
//             fs.rmSync("/.stader/data", { recursive: true, force: true /* ignore if not exists */ });

//             // unzip
//             const zip = new AdmZip(zipfilePath);
//             zip.extractAllTo("/.stader/", /*overwrite*/ true);

//             res.send({
//                 code: 200,
//                 message: "Successfully uploaded the Stader backup. Click restart to complete the restore.",
//             });
//             return next();
//         } catch (e) {
//             console.dir(e);
//             console.log(e);
//             res.send({
//                 code: 400,
//                 message: e.message,
//             });
//             return next();
//         }
//     }

//     function validateZipFile(zipfilePath) {
//         console.log("Validating " + zipfilePath);
//         const zip = new AdmZip(zipfilePath);
//         const zipEntries = zip.getEntries();

//         checkFileExistsInZipFile(zipEntries, "data/password")
//         checkFileExistsInZipFile(zipEntries, "data/mnemonic")
//         checkFileExistsInZipFile(zipEntries, "data/wallet")
//         checkFileExistsInZipFile(zipEntries, "data/validators/prysm-non-hd/direct/accounts/all-accounts.keystore.json")
//         checkFileExistsInZipFile(zipEntries, "data/validators/prysm-non-hd/direct/accounts/secret")
//         checkFileExistsInZipFile(zipEntries, "data/validators/prysm-non-hd/direct/keymanageropts.json")
//     }

//     function checkFileExistsInZipFile(zipEntries, expectedPath) {
//         const containsFile = zipEntries.some((entry) => entry.entryName == expectedPath);
//         if (!containsFile)
//             throw {message:`Invalid backup file. The zip file must contain "${expectedPath}"`}
//     }
// });

server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
    // supervisorCtl.callMethod("supervisor.getState", []).then((value: any) => {
    //     console.log("supervisor", value.statename)
    // })
});

