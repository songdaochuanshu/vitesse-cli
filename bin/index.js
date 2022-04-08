#!/usr/bin/env node
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const shell = require("shelljs");
import ora from "ora";
const { prompt } = require("inquirer");

const version = require("../package.json").version;
const spinner = ora("Downloading\n");
console.log('vitesse-cli v' + version);
const remotes = {
  vitesse: "git@github.com:antfu/vitesse.git",
  "vitesse-lite": "git@github.com:antfu/vitesse-lite.git",
  "vitesse-nuxt3": "git@github.com:antfu/vitesse-nuxt3.git",
  "vitesse-nuxt-bridge": "git@github.com:antfu/vitesse-nuxt-bridge.git",
  "vitesse-webext": "git@github.com:antfu/vitesse-webext.git",
  "vitesse-ssr": "git@github.com:frandiox/vitesse-ssr-template.git",
  "vitesse-lite-react": "git@github.com:lxy-yz/vitesse-lite-react.git",
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
  shell.exec(
    `git clone ${remotes[answers.template]} ${answers.username}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return;
      }
      shell.cd(answers.username);
      shell.rm("-rf", ".git");
      shell.rm("-rf", ".github");
      shell.rm("-rf", "LICENSE");
      console.log("\x1b[32m%s\x1b[0m", "create project success!");
      console.log(
        "\x1b[34m%s\x1b[0m",
        `please "cd ${answers.username}" and "npm install && npm run dev"`
      );
      spinner.stop();
      process.exit(0);
    }
  );
});
