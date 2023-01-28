import fs from "fs";
import inquirer from "inquirer";
import path from "path";

import Manager from "./lib/Manager.js";
import Engineer from "./lib/Engineer.js";
import Intern from "./lib/Intern.js";

// const OUTPUT_DIR = path.resolve(__dirname, "output");
// const outputPath = path.join(OUTPUT_DIR, "team.html");

// const render = require("./src/page-template.js");

// TODO: Write Code to gather information about the development team members, and render the HTML file.

// * Create a command-line application that accepts accepts user input using the provided starter code.
//   * Create classes for each team member provided and export them. The tests for these classes (in the `_tests_` directory) must ALL pass.
//     * The first class is an `Employee` parent class with the following properties and methods:
//       * `name`
//       * `id`
//       * `email`
//       * `getName()`
//       * `getId()`
//       * `getEmail()`
//       * `getRole()`&mdash;returns `'Employee'`
//     * The other three classes will extend `Employee`.
//     * In addition to `Employee`'s properties and methods, `Manager` will also have the following:
//       * `officeNumber`
//       * `getRole()`&mdash;overridden to return `'Manager'`
//     * In addition to `Employee`'s properties and methods, `Engineer` will also have the following:
//       * `github`&mdash;GitHub username
//       * `getGithub()`
//       * `getRole()`&mdash;overridden to return `'Engineer'`
//     * In addition to `Employee`'s properties and methods, `Intern` will also have the following:
//       * `school`
//       * `getSchool()`
//       * `getRole()`&mdash;overridden to return `'Intern'`

//     * Finally, although it’s not a requirement, consider adding validation to ensure that user input is in the proper format.

//   * Write code in `index.js` that uses inquirer to gather information about the development team members and creates objects for each team member using the correct classes as blueprints.
//     * When a user starts the application then they are prompted to enter the **team manager**’s:
//       * Name
//       * Employee ID
//       * Email address
//       * Office number
//     * When a user enters those requirements then the user is presented with a menu with the option to:
//       * Add an engineer
//       * Add an intern
//       * Finish building the team
//     * When a user selects the **engineer** option then a user is prompted to enter the following and then the user is taken back to the menu:
//       * Engineer's Name
//       * ID
//       * Email
//       * GitHub username
//     * When a user selects the intern option then a user is prompted to enter the following and then the user is taken back to the menu:
//       * Intern’s name
//       * ID
//       * Email
//       * School
//     * When a user decides to finish building their team then they exit the application, and the HTML is generated.
//   * Call the `render` function (provided for you) and pass in an array containing all employee objects;
//     * The `render` function will generate and return a block of HTML including templated divs for each employee!
//   * Create an HTML file using the HTML returned from the `render` function.
//     * Write it to a file named `team.html` in the `output` folder.
//     * You can use the provided variable `outputPath` to target this location.

const teamMembers = [];
const idArray = [];

// All common questions
const commonQuestions = [
  {
    type: "input",
    name: "name",
    message: "What is your name?",
    default() {
      return "Marius Paduraru";
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
      return "marius@mail.com";
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

const selectTeamMemberQuestion = [
  {
    type: "list",
    name: "moreMembers",
    message: "Would you like to add a team member?",
    choices: ["Add an engineer", "Add an intern", "Finish building the team"],
  },
];

const managerQuestions = [
  ...commonQuestions,
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

const engineerQuestions = [
  ...commonQuestions,
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

const internQuestions = [
  ...commonQuestions,
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
        console.log("No more team members to add.");
    }
  });
};

const addEngineer = () => {
  inquirer.prompt(engineerQuestions).then((answers) => {
    const { name, id, email, github, moreMembers } = answers;
    const engineer = new Engineer(name, id, email, github);
    teamMembers.push(engineer);
    idArray.push(id);

    console.log(teamMembers);

    switch (moreMembers) {
      case "Yes":
        choseWhatRoleToAdd();
        break;
      default:
        console.log("No more team members to add.");
    }
  });
};

const addIntern = () => {
  inquirer.prompt(internQuestions).then((answers) => {
    const { name, id, email, school, moreMembers } = answers;
    const intern = new Intern(name, id, email, school);
    teamMembers.push(intern);
    idArray.push(id);

    console.log(teamMembers);

    switch (moreMembers) {
      case "Yes":
        choseWhatRoleToAdd();
        break;
      default:
        console.log("No more team members to add.");
    }
  });
};

const addManager = () => {
  inquirer.prompt(managerQuestions).then((answers) => {
    const { name, id, email, officeNumber, moreMembers } = answers;
    const manager = new Manager(name, id, email, officeNumber);
    teamMembers.push(manager);
    idArray.push(id);

    console.log(teamMembers);

    switch (moreMembers) {
      case "Add an engineer":
        addEngineer();
        break;
      case "Add an intern":
        addIntern();
        break;
      default:
        console.log("No more team members to add.");
    }
  });
};

addManager();
