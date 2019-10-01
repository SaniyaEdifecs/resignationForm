const validateFormValues = (inputs, key, fieldsToValidate) => {
  console.log("validate values", inputs, key);
  let errors = {};
  // Employee code 

  fieldsToValidate.every(formField => {
    if(formField === key && !inputs[key]){
      errors[formField] = formField+" is required";
      console.log("in errors ",errors)
      return errors;
    }
    if(key === undefined){
      errors[formField] = formField+" is required";
    }
  });

  console.log("final errrors = ",errors)
  return errors;

  
  // if (!inputs.EmployeeCode) {
  //   errors['EmployeeCode'] = 'Employee Code is required';
  //   if (key === 'EmployeeCode' && key !== undefined) 
  //   return errors;
  // }
  // // First Name 
  // if (!inputs.FirstName) {
  //   errors['FirstName'] = 'First Name is required';
  //   if (key === 'FirstName' && key !== undefined) return errors;

  // }
  // // Last Name 
  // if (!inputs.LastName) {
  //   errors['LastName'] = 'Last Name is required';
  //   if (key === 'LastName' && key !== undefined) return errors;

  // }
  // //  Email is reuiqred
  // if (!inputs.WorkEmail) {
  //   errors['WorkEmail'] = 'Email is Required';
  //   if (key === 'WorkEmail' && key !== undefined) return errors;

  // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputs.WorkEmail)) {
  //   errors['WorkEmail'] = 'Invalid email address';
  //   if (key === 'WorkEmail' && key !== undefined) return errors;

  // }

  // return errors;

};

export default validateFormValues;