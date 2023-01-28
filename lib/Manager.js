// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.

//  * In addition to `Employee`'s properties and methods, `Manager` will also have the following:
//    * `officeNumber`
//    * `getRole()`&mdash;overridden to return `'Manager'`
import Employee from "./Employee.js";

class Manager extends Employee {
  constructor(name, id, email, officeNumber) {
    super(name, id, email);
    this.officeNumber = officeNumber;
  }
  getRole() {
    return "Manager";
  }
  getOfficeNumber() {
    return this.officeNumber;
  }
}

export default Manager;
