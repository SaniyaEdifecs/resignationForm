import { useState, useEffect, useCallback } from 'react';

const useForm = (stateSchema, validationSchema = {}, callback) => {
  const [state, setState] = useState(stateSchema);
  const [status, setStatus] = useState("Pending");
  const [disable, setDisable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // Disable button in initial render.
  useEffect(() => { setDisable(true); }, []);
  // For every changed in our state this will be fired
  // To be able to disable the button

  const validateState = useCallback(() => {
    const hasErrorInState = Object.keys(validationSchema).some(key => {
      const isInputFieldRequired = validationSchema[key].required;
       const stateValue = state[key].value; // state value
       const stateError = state[key].error;
    
      // state error
      return (isInputFieldRequired && !stateValue) || stateError;
    });

    return hasErrorInState;
  }, [state, validationSchema]);


  useEffect(() => {
    if (isDirty) {
      setDisable(validateState());
    }
  }, [state, isDirty]);

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
    console.log(event.target.type);
    if (event.target.type == "checkbox") {
      name = event.target.name;
      value = event.target.checked;
    } else {
      name = event.target.name;
      value = event.target.value;
    }
    // console.log(name, value);
    let error = '';
    if (name != "DuesPending" && validationSchema[name].required) {
      if (!value) {
        error = 'This is required field.';
      }
      // if (
      //   validationSchema[name].validator !== null &&
      //   typeof validationSchema[name].validator === 'object'
      // ) {
      //   if (value && !validationSchema[name].validator.regEx.test(value)) {
      //     error = validationSchema[name].validator.error;
      //   }
      // }
    }
    if ((event.target.type != "text" && event.target.type != "textarea") && (name != "DuesPending" && value.toLowerCase() == "no" )) {
      error = "Dues Pending";
    }
    setState(prevState => ({
      ...prevState,
      [name]: { value, error },
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

  const saveForm = useCallback(
    event => {
      event.preventDefault();
      callback(state);
    },
    [state]
  );

  const handleOnSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!validateState()) {
        callback(state);
      }
    },
    [state]
  );
  return { state, disable, saveForm, status, setStatus, setIsDirty , handleOnChange, setState, handleOnBlur, handleOnSubmit };
};

export default useForm;