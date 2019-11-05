import { useState, useEffect, useCallback } from 'react';
import { sp, ItemAddResult } from '@pnp/sp';


const useForm = (stateSchema, validationSchema = {}, callback) => {
  const [state, setState] = useState(stateSchema);
  const [Status, setStatus] = useState("Pending");
  const [disable, setDisable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // Disable button in initial render.
  useEffect(() => {setDisable(true);}, []);

  const validateState = useCallback(() => {
    const hasErrorInState = Object.keys(validationSchema).some(key => {
      const isInputFieldRequired = validationSchema[key].required;
      const stateValue = state[key].value; // state value
      const stateError = state[key].error; // state error
      return (isInputFieldRequired && !stateValue) || stateError;
    });

    return hasErrorInState;
  }, [state, validationSchema]);

  // For every changed in our state this will be fired
  // To be able to disable the button
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

  const checkValidation = (event) => {
    setIsDirty(true);
    const name = event.target.name;
    const value = event.target.value;
    let error = '';
    if (validationSchema[name].required) {
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
    setState(prevState => ({
      ...prevState,
      [name]: { value, error },
    }));
  }

  // Used to handle every changes in every input
  const handleOnBlur = useCallback(
    event => {
      setIsDirty(true);
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

  const getPeoplePickerItems = useCallback(items => {
    console.log("people picker", items);
    // const getPeoplePickerItems = (items: any[]) => {
    if (items) {
      let peoplePickerValue = items[0];
      let fullName = peoplePickerValue.text.split(' ');
      let mFirstName = fullName[0];
      let mLastName = fullName[fullName.length - 1];
      let mEmail = peoplePickerValue.secondaryText;
      console.log(mEmail, mLastName, mFirstName);
      setState(prevState => ({ ...prevState, ['ManagerFirstName']: ({ value: mFirstName, error: " " }), ['ManagerLastName']: ({ value: mLastName, error: "" }), ['ManagerEmail']: ({ value: mEmail, error: "" }) }));
    }
  }, [validationSchema]);

  const _getPeoplePickerItems = useCallback(items => {
    console.log("people picker", items);
    // const getPeoplePickerItems = (items: any[]) => {
    if (items) {

      let peoplePickerValue = items[0];
      let fullName = peoplePickerValue.text.split(' ');
      let eFirstName = fullName[0];
      let eLastName = fullName[fullName.length - 1];
      let eEmail = peoplePickerValue.secondaryText;
      console.log(eEmail, eLastName, eFirstName);
      setState(prevState => ({ ...prevState, ['FirstName']: ({ value: eFirstName, error: " " }), ['LastName']: ({ value: eLastName, error: "" }), ['WorkEmail']: ({ value: eEmail, error: "" }), ['ID']: ({ value: peoplePickerValue.id, error: "" }) }));
    }
  }, [validationSchema]);

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
  return { state, disable, saveForm, Status, setStatus, handleOnChange, setState, handleOnBlur, handleOnSubmit, getPeoplePickerItems, _getPeoplePickerItems };
};

export default useForm;