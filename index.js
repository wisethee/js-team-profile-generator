import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { fileURLToPath } from "url";

import Manager from "./lib/Manager.js";
import Engineer from "./lib/Engineer.js";
import Intern from "./lib/Intern.js";

import render from "./src/page-template.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// TODO: Write Code to gather information about the development team members, and render the HTML file.

const teamMembers = [];

/**
 * after the user finished answering all questions, the user exit the application
 * function **renderTeamMembers** is called to render the HTML file
 */
const renderTeamMembers = () => {
  return fs.writeFileSync(outputPath, render(teamMembers));
};

/**
 * the user is prompted to enter the **team manager**’s: name, ID, and email address
 * if the name is empty, the user is prompted to enter at least one character
 * if the ID is empty, the user is prompted to enter a positive number greater than zero
 * if the email is empty, the user is prompted to enter a valid email address
 */
const employeeQuestions = [
  {
    type: "input",
    name: "name",
    message: "What is your name?",
    default() {
      return "Roy Glenn";
    },
    validate: (answer) => {
      if (answer !== "") {
        return true;
      }
      return "Please enter at least one character.";
    },
  },
  {
    type: "input",
    name: "id",
    message: "What is your employee ID?",
    default() {
      return "9";
    },
    validate: (answer) => {
      const pass = answer.match(/^[1-9]\d*$/);
      if (pass) {
        return true;
      }
      return "Please enter a positive number greater than zero.";
    },
  },
  {
    type: "input",
    name: "email",
    message: "What is your email address?",
    default() {
      return "roy@mail.com";
    },
    validate: (answer) => {
      const pass = answer.match(/\S+@\S+\.\S+/);
      if (pass) {
        return true;
      }
      return "Please enter a valid email address.";
    },
  },
];

/**
 * after the initialization and the user answered all employee questions,
 * the user is prompted to select one of the following options from **selectTeamMemberQuestion**:
 * if the selected answer is **Add an engineer** or **Add an intern**, the user is prompted to enter additional information's
 * else if the selected answer is **Finish building the team**, the user is prompted to exit the application
 */
const selectTeamMemberQuestion = [
  {
    type: "list",
    name: "moreMembers",
    message: "Would you like to add a team member?",
    choices: ["Add an engineer", "Add an intern", "Finish building the team"],
  },
];

/**
 * at initialization, after the user answered employee questions
 * the user is prompted to enter the **team manager**’s: office number
 * if the office number is empty, the user is prompted to enter a positive number greater than zero
 * after the user answered all manager questions, the user is prompted to select one of the following options from **selectTeamMemberQuestion**
 */
const managerQuestions = [
  ...employeeQuestions,
  {
    type: "input",
    name: "officeNumber",
    message: "What is your office number?",
    default() {
      return "369";
    },
    validate: (answer) => {
      const pass = answer.match(/^[1-9]\d*$/);
      if (pass) {
        return true;
      }
      return "Please enter a positive number greater than zero.";
    },
  },
  ...selectTeamMemberQuestion,
];

/**
 * after the user selected **Add an engineer** from **selectTeamMemberQuestion**
 * the user is prompted to enter the following: name, ID, email address, and GitHub username
 * if the name is empty, the user is prompted to enter at least one character
 * if the ID is empty, the user is prompted to enter a positive number greater than zero
 * if the email is empty, the user is prompted to enter a valid email address
 * if the GitHub username is empty, the user is prompted to enter at least one character
 * after the user answered all engineer questions, the user is prompted to select if he would like to add another team member
 */
const engineerQuestions = [
  ...employeeQuestions,
  {
    type: "input",
    name: "github",
    message: "What is your GitHub username?",
    validate: (answer) => {
      if (answer !== "") {
        return true;
      }
      return "Please enter at least one character.";
    },
  },
  {
    type: "list",
    name: "moreMembers",
    message: "Would you like to add another team member?",
    choices: ["Yes", "No"],
  },
];

/**
 * after the user selected **Add an intern** from **selectTeamMemberQuestion**
 * the user is prompted to enter the following: name, ID, email address, and school
 * if the name is empty, the user is prompted to enter at least one character
 * if the ID is empty, the user is prompted to enter a positive number greater than zero
 * if the email is empty, the user is prompted to enter a valid email address
 * if the school is empty, the user is prompted to enter at least one character
 * after the user answered all intern questions, the user is prompted to select if he would like to add another team member
 */
const internQuestions = [
  ...employeeQuestions,
  {
    type: "input",
    name: "school",
    message: "What school do you attend?",
    validate: (answer) => {
      if (answer !== "") {
        return true;
      }
      return "Please enter at least one character.";
    },
  },
  {
    type: "list",
    name: "moreMembers",
    message: "Would you like to add another team member?",
    choices: ["Yes", "No"],
  },
];

/**
 * after and engineer or an intern is added to the team, the user is prompted to select if he would like to add another team member
 * if the selected answer is **Add an engineer** or **Add an intern**, the user is prompted to enter additional information's
 * else if the selected answer is **Finish building the team**, the user is prompted to exit the application
 */
const choseWhatRoleToAdd = () => {
  inquirer.prompt(selectTeamMemberQuestion).then((answers) => {
    const { moreMembers } = answers;

    switch (moreMembers) {
      case "Add an engineer":
        addEngineer();
        break;
      case "Add an intern":
        addIntern();
        break;
      default:
        renderTeamMembers();
        console.log("No more team members to add.");
    }
  });
};

/**
 * add a new engineer to the **teamMembers** array
 * prompt the user to select if he would like to add another team member
 */
const addEngineer = () => {
  inquirer.prompt(engineerQuestions).then((answers) => {
    const { name, id, email, github, moreMembers } = answers;
    const engineer = new Engineer(name, id, email, github);
    teamMembers.push(engineer);

    switch (moreMembers) {
      case "Yes":
        choseWhatRoleToAdd();
        break;
      default:
        renderTeamMembers();
        console.log("No more team members to add.");
    }
  });
};

/**
 * add a new intern to the **teamMembers** array
 * prompt the user to select if he would like to add another team member
 */
const addIntern = () => {
  inquirer.prompt(internQuestions).then((answers) => {
    const { name, id, email, school, moreMembers } = answers;
    const intern = new Intern(name, id, email, school);
    teamMembers.push(intern);

    switch (moreMembers) {
      case "Yes":
        choseWhatRoleToAdd();
        break;
      default:
        renderTeamMembers();
        console.log("No more team members to add.");
    }
  });
};

/**
 * add the manager to the **teamMembers** array
 * prompt the user to select if he would like to add another team member
 */
const addManager = () => {
  inquirer.prompt(managerQuestions).then((answers) => {
    const { name, id, email, officeNumber, moreMembers } = answers;
    const manager = new Manager(name, id, email, officeNumber);
    teamMembers.push(manager);

    switch (moreMembers) {
      case "Add an engineer":
        addEngineer();
        break;
      case "Add an intern":
        addIntern();
        break;
      default:
        renderTeamMembers();
        console.log("No more team members to add.");
    }
  });
};

addManager();
