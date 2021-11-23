import { useState, useEffect, useCallback } from 'react';


const resignationUseForm = (stateSchema, validationSchema = {}, callback) => {
  const [state, setState] = useState(stateSchema);
  const [status, setStatus] = useState("Pending");
  const [disable, setDisable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  const validateState = useCallback(() => {
    const hasErrorInState = Object.keys(validationSchema).some(key => {
      const isInputFieldRequired = validationSchema[key].required;
      const stateValue = state[key].value;
      let validateStateValue: boolean;
      const stateError = state[key].error;

      validateStateValue = (isInputFieldRequired && !stateValue) || stateError;

      return validateStateValue;

    });
    return hasErrorInState;
  }, [state, validationSchema]);


  useEffect(() => {
    if (isDirty) {
      setDisable(validateState());
    }
  }, [state, isDirty]);
  useEffect(() => {
  }, [validationSchema]);

  // Set the status property based on validation
  useEffect(() => {
    if (validateState()) {
      setStatus("Pending");
    } else {
      setStatus("Approved");
    }
  }, [state]);

  let name: any;
  let value: any;
  const checkValidation = (event) => {
    setIsDirty(true);
    name = event.target.name;
    value = event.target.value;
    let error = '';
    // console.log('event', event.target);
     
    // if(event.target.type === 'checkbox'){
    //   value= event.target.checked;
    //   setState(prevState =>({ ...prevState, [name]:{value,error} }));
    // }
  // if(event.target.name === "noticePeriod"){

  //   handleDateChange()
  // }

     if (validationSchema[name].required) {
      if (!value) {
        error = 'This is required field.';
      }
    }

    setState(prevState => ({
      ...prevState,
      [name]: { value, error }
    }));
  };



  // Used to handle every changes in every input
  const handleOnBlur = useCallback(
    event => {
      checkValidation(event);
    },
    [validationSchema]
  );

  const handleOnChange = useCallback(
    event => {
      checkValidation(event);
    },
    [validationSchema]
  );
  const getPeoplePickerItems = (items) => {
    if (items[0]) {
      setIsDirty(true);
      let peoplePickerValue = items[0];
      let fullName = peoplePickerValue.text.split(' ');
      let mFirstName = fullName.shift();
      let mLastName = fullName.pop();
      setState(prevState => ({ ...prevState, ['ManagerFirstName']: ({ value: mFirstName, error: "" }), ['ManagerLastName']: ({ value:  mLastName, error: "" }), ['ManagerEmail']: ({ value: peoplePickerValue.secondaryText, error: "" }) }));
    }
    else {
      setState(prevState => ({ ...prevState, ['ManagerFirstName']: ({ value: "", error: "" }), ['ManagerLastName']: ({ value:  "", error: "" }), ['ManagerEmail']: ({ value: "", error: "" }) }));
    }
  };


  const handleOnSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!validateState()) {
        callback(state);
      }
    },
    [state]
  );
  return { state, disable, status, setIsDirty, handleOnChange, setState, handleOnBlur, getPeoplePickerItems, handleOnSubmit };
};

export default resignationUseForm;