#!/usr/bin/env node
const inquirer = require("inquirer");
const shell = require("shelljs");

const remotes = {
  "vitesse-lite": "https://github.com/antfu/vitesse-lite.git",
  "vitesse-nuxt3": "https://github.com/antfu/vitesse-nuxt3.git",
  "vitesse-nuxt-bridge": "https://github.com/antfu/vitesse-nuxt-bridge.git",
  "vitesse-webext": "https://github.com/antfu/vitesse-webext.git",
  "vitesse-ssr": "https://github.com/frandiox/vitesse-ssr-template.git",
  "vitesse-lite-react": "https://github.com/lxy-yz/vitesse-lite-react.git",
};

// Ask the user, interact with the user
// The object of the specified format is stored in the PROMPT array, which is called Question object.
inquirer
  .prompt([
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
  ])
  .then((answers) => {
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
        process.exit(0);
      }
    );
  });
