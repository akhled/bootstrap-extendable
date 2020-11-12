const { exec, spawn } = require("child_process");
const { resolve } = require("path");

/**
 * Build process
 *
 * 1. Increase version in main scss
 * 2. Build the css file
 * 3. Build the minified css file
 * 4. Generate the docs
 * 5. Commit changes
 * 6. Update package.json version
 * 7. Publish to npmjs.org
 */

class Command {
    constructor(command) {
        this.originalCommand = command;
        let args = command.split(' ');
        command = args.shift()
        this.command = spawn(command, args)
    }

    async listen() {
        this.command.stdout.on("data", data => {
            console.log(`${data}`);
        });

        this.command.stderr.on("data", data => {
            console.log(`${data}`);
        });

        this.command.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });

        return await new Promise(() => {
            this.command.on("close", code => {
                console.log(`✅ ${this.originalCommand} is done with code ${code}`);
                resolve()
            })
        })
    }
}

class Publish {
    async buildCss() {
        const command = new Command('npm run dev');
        return await new Promise(async (resolve) => {
            return await command.listen().then(_ => resolve())
        })
    }

    buildMinifyCss() {
        new Command('npm run prod');
    }
}

const publish = new Publish();
const com = publish.buildCss()
com.then(() => console.log('there'))
// publish.buildMinifyCss()
return;
exec("npm run dev", commandCallback(error, stdout, stderr, (stop) => {
    if (stop) return;

    exec("npm run prod", commandCallback(error, stdout, stderr, (stop) => {
        if (stop) return;

        // exec("npm run prod", commandCallback(error, stdout, stderr, (stop) => {
    }));
}));

async function commandCallback(error, stdout, stderr) {
    return await new Promise((resolve, reject) => {
        if (error) {
            console.log(`error: ${error.message}`);
            reject(error.message)
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            reject(stderr)
        }
        console.log(`stderr: ${stdout}`);
        resolve()
    })
}
// npm version patch && npm publish--access public

/* ------------------------------------------------------ */
/*                           //                           */
/* ------------------------------------------------------ */
