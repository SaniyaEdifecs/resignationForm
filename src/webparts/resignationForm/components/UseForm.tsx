import { useState, useEffect, useCallback } from 'react';

const useForm = (stateSchema, validationSchema = {}, callback) => {
  const [state, setState] = useState(stateSchema);
  const [status, setStatus] = useState("Pending");
  const [disable, setDisable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // // Disable button in initial render.
  // useEffect(() => { setDisable(true); }, []);

  const validateState = useCallback(() => {
    const hasErrorInState = Object.keys(validationSchema).some(key => {
      const isInputFieldRequired = validationSchema[key].required;
      const stateValue = state[key].value;
      let validateStateValue: boolean;
      const stateError = state[key].error;
      // if (state.DuesPending) {
      //   validateStateValue =  state['DuesPending'].value === 'NotifyAssociate';
      // } else {
      validateStateValue = (isInputFieldRequired && !stateValue) || stateError;
      // }
      return validateStateValue;

    });
    return hasErrorInState;
  }, [state, validationSchema]);


  useEffect(() => {
    if (isDirty ) {
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
      Object.keys(state).forEach(name => {
        let duesValue = state['DuesPending'].value;
        console.log('check dues value', duesValue);
        if (duesValue === 'NotifyAssociate') {
          setStatus('Pending');
          
        }
        else {
          setStatus("Approved");
        }
      });

    }

  }, [state]);

  let name: any;
  let value: any;
  const checkValidation = (state) => {
    let hasError = false;
    Object.keys(state).forEach(name => {
      let error = '';
      let value = state[name].value;
      if (validationSchema[name] && validationSchema[name].required) {
        if (!value && name != 'DuesPending') {
          console.log(name, value)
          hasError = true;
          error = 'This is required field.';
          console.log(name, value, error)

        }
      }
      setState(prevState => ({
        ...prevState,
        [name]: { value, error }
      }));
    });
    return hasError;
  };



  // Used to handle every changes in every input
  const setInputValues = (event) => {
    let error = '';
    setIsDirty(true);
    if (event.target.value == 'GrantClearance') {
      name = event.target.name;
      if (!checkValidation(state)) {
        value = event.target.value;
      } else {
        error = 'All fields are must to grant clearance.'
        setState(prevState => ({
          ...prevState,
          [name]: { value, error }
        }));
      }
      //  ;

    } else if (event.target.type == "checkbox") {
      name = event.target.name;
      value = event.target.checked;
    } else {
      name = event.target.name;
      value = event.target.value;
    }

    setState(prevState => ({
      ...prevState,
      [name]: { value, error }
    }));
  }
  const handleOnBlur = useCallback(
    event => {
      setInputValues(event);
    },
    [validationSchema]
  );

  const handleOnChange = useCallback(
    event => {
      setInputValues(event);
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
  return { state, disable, setDisable, saveForm, status, setStatus, setIsDirty, handleOnChange, setState, handleOnBlur, handleOnSubmit };
};

export default useForm;