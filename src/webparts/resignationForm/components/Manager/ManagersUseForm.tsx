import { useState, useEffect, useCallback } from 'react';
import { setDate } from 'date-fns';

const useForm = (stateSchema, validationSchema = {}, callback) => {
  const [state, setState] = useState(stateSchema);

  const [disable, setDisable] = useState(true);
  const [isDirty, setIsDirty] = useState(false);

  // Disable button in initial render.
  useEffect(() => {
    setDisable(true);
  }, []);

  // For every changed in our state this will be fired
  // To be able to disable the button
  useEffect(() => {
    if (isDirty) {
      setDisable(validateState());
    }
  }, [state, isDirty]);
  const validateState = useCallback(() => {
    const hasErrorInState = Object.keys(validationSchema).some(key => {
      const isInputFieldRequired = validationSchema[key].required;
      const stateValue = state[key].value; // state value
      const stateError = state[key].error; // state error

      return (isInputFieldRequired && !stateValue) || stateError;
    });

    return hasErrorInState;
  }, [state, validationSchema]);

 

  const handleOnChange = useCallback(
    event => {

      console.log(event);
      setIsDirty(true);
      const name = event.target.name;
      const value = event.target.value;
      let error = '';
      // if (validationSchema[name].required) {
      //   if (!value) {
      //     error = 'This is required field.';
      //   }
      // }
     setState(prevState => ({
        ...prevState,
        [name]: { value, error },
      }));
    },
    [validationSchema]
  );

  const handleOnSubmit = useCallback(
    event => {
      event.preventDefault();
      
      callback(state);
    },
    [state]
  );

  return { state, disable, setState, handleOnChange, handleOnSubmit};
};

export default useForm;