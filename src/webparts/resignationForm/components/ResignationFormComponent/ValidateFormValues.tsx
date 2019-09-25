const validateFormValues = (inputs) => {
  console.log("validate values",inputs);
  let errors = {};
  // Employee code 
  if (!inputs.EmployeeCode) {
    errors[inputs.EmployeeCode] = 'Employee Code is required';
  }
  // First Name 
  if (!inputs.FirstName) {
    errors[inputs.FirstName] = 'First Name is required';
  }
 // Last Name 
  if (!inputs.LastName) {
    errors[inputs.LastName] = 'Last Name is required';
  }
  //  Email is reuiqred
  if (!inputs.WorkEmail) {
    errors[inputs.WorkEmail] = 'Email is Required';
  } else if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputs.WorkEmail)) {
    errors[inputs.WorkEmail] = 'Invalid email address';
  }
  return errors;

};

export default validateFormValues;