#!/usr/bin/env node
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const shell = require("shelljs");
import ora from "ora";
const { prompt } = require("inquirer");
const download = require("download-git-repo");
const version = require("../package.json").version;
const spinner = ora("Downloading\n");
console.log("vitesse-cli v" + version);
const remotes = {
  vitesse: "antfu/vitesse",
  "vitesse-lite": "antfu/vitesse-lite",
  "vitesse-nuxt3": "antfu/vitesse-nuxt3",
  "vitesse-nuxt-bridge": "antfu/vitesse-nuxt-bridge",
  "vitesse-webext": "antfu/vitesse-webext",
  "vitesse-ssr": "frandiox/vitesse-ssr-template",
  "vitesse-lite-react": "lxy-yz/vitesse-lite-react",
};

// Ask the user, interact with the user
// The object of the specified format is stored in the PROMPT array, which is called Question object.

prompt([
  {
    type: "input",
    name: "username",
    message: "please input your vitesse project name",
    default: "vitesse-app",
    // Verify data or selected data entered by the user
    validate(val) {
      if (val.trim() === "") {
        return "project name can not be empty";
      }
      return true;
    },
    // Filter data or selected data entered by the user
    filter(val) {
      return val.toLowerCase();
    },
  },
  {
    type: "list",
    name: "template",
    message: "Please select a template",
    choices: [...Object.keys(remotes)],
    default: 0,
  },
]).then((answers) => {
  spinner.start();
  download(remotes[answers.template], answers.username, function (err) {
    console.log(err ? "Error" : "Success");
    shell.cd(answers.username);
    shell.rm("-rf", ".git");
    shell.rm("-rf", ".github");
    shell.rm("-rf", "LICENSE");
    console.log("\x1b[32m%s\x1b[0m", "create project success!");
    console.log(
      "\x1b[34m%s\x1b[0m",
      `please 'cd ${answers.username}' and 'npm install && npm run dev'`
    );
    spinner.stop();
    process.exit(0);
  });
});
