import * as React from 'react';
import useForm from '../UseForm';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Button, TextField, Grid, Container, Select, MenuItem, FormControl, InputLabel, Typography } from '@material-ui/core';
import { sp, ItemAddResult } from '@pnp/sp';
import { useEffect, useState } from 'react';
import { element } from 'prop-types';

const EmployeeDetails = (props) => {
    // Define your state schema
    // const [isdisable, setDisable] = useState(false);
    const[employeeNameId, setEmployeeNameId] = useState();
    const formFields = [
        "EmployeeCode",
        "FirstName",
        "LastName",
        "PersonalEmail",
        "PersonalPhone"
    ];

    var stateSchema = {};
    var validationStateSchema = {};
    formFields.forEach(formField => {
        stateSchema[formField] = {};
        stateSchema[formField].value = "";
        stateSchema[formField].error = "";
        validationStateSchema[formField] = {};
        validationStateSchema[formField].required = true;
        validationStateSchema[formField].validator = {
            regex: '',
            error: ''
        };

    });
  
      const _getPeoplePickerItems = (items) => {
        if (items[0]) {
            setIsDirty(true);
          let peoplePickerValue = items[0];
          let fullName = peoplePickerValue.text.split(' ');
          let eFirstName = fullName[0];
          let eLastName = fullName[fullName.length - 1];
          let eEmail = peoplePickerValue.secondaryText;
          console.log(eEmail, eLastName, eFirstName);
          setState(prevState => ({ ...prevState, ['FirstName']: ({ value: eFirstName, error: "" }), ['LastName']: ({ value: eLastName, error: "" }) }));
        }
        else{
            setState(prevState => ({ ...prevState, ['FirstName']: ({ value: "", error: "" }), ['LastName']: ({ value: "", error: "" }),  }));
        }
      };

    const { state, handleOnChange, handleOnSubmit, disable, setState, handleOnBlur, setIsDirty } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );
    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };

    const getEmployeeDetails = (employeeID) => {
        sp.web.lists.getByTitle("Employee%20Details").items.getById(employeeID).get().then((detail: any) => {
            setEmployeeNameId(detail.EmployeeNameId);
            formFields.forEach(formField => {
                if (detail[formField] == null) {
                    stateSchema[formField].value = "";
                    stateSchema[formField].error = "";
                } else {
                    stateSchema[formField].value = detail[formField] + "";
                    stateSchema[formField].error = "";
                }
            });
            setState(prevState => ({ ...prevState, stateSchema }));
            // setDisable(true);
        });
    };
    useEffect(() => {
        console.log(props.props);
        if (props.props) {
            getEmployeeDetails(props.props);
        }
    }, []);

    const addListItem = (elements) => {
        let ID = props.props;
        let list = sp.web.lists.getByTitle("Employee%20Details");
        if (ID) {
            list.items.getById(ID).update(elements).then(item => {
                sp.web.lists.getByTitle("ResignationList").items.getById(employeeNameId).update({'PersonalEmail': elements.PersonalEmail}).then(response =>{
                });
                setState(stateSchema);
                window.location.href = "?component=employeeDashboard";
                //  redirect to dashboard
            });
        } 
        // else {
        //     list.items.add(elements).then((items: ItemAddResult): void => {
        //         let item = items.data;
        //         console.log("check here id value",item);
        //         if (item) {
        //             sp.web.lists.getByTitle("Employee%20Details").items.add({EmployeeNameId: item.ID}).then((item: ItemAddResult) => {
        //             });
                   
        //             setState(stateSchema);
        //         }
        //     }, (error: any): void => {
        //         console.log('Error while creating the item: ' + error);
        //     });
        // }
    };

    function onSubmitForm(state) {
        for (const key in state) {
            state[key] = state[key].value;
        }
        addListItem(state);
    }

    return (
        <Container component="main">
            <div className="formView">
                <Typography variant="h5" component="h3">
                   Employee Detail
                </Typography>
                <form onSubmit={handleOnSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Employee Code" value={state.EmployeeCode.value} name="EmployeeCode" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} helperText="Please write code as written on pay slip" />
                            {state.EmployeeCode.error && <p style={errorStyle}>{state.EmployeeCode.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <PeoplePicker context={props.context} defaultSelectedUsers={[state.FirstName.value]} ensureUser={true} titleText="Employee Name" isRequired={true} errorMessage="This field is required." personSelectionLimit={1} showtooltip={true} selectedItems={_getPeoplePickerItems} showHiddenInUI={false} principalTypes={[PrincipalType.User]} resolveDelay={100} />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="First Name" value={state.FirstName.value} name="FirstName" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.FirstName.error && <p style={errorStyle}>{state.FirstName.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Last Name"  value={state.LastName.value}  name="LastName" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.LastName.error && <p style={errorStyle}>{state.LastName.error}</p>}
                        </Grid>
                    </Grid>
                  
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Personal Email" value={state.PersonalEmail.value} name="PersonalEmail" onBlur={handleOnBlur} autoComplete="personalEmail" onChange={handleOnChange} />
                            {state.PersonalEmail.error && <p style={errorStyle}>{state.PersonalEmail.error}</p>}
                        </Grid> 
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Personal Phone" value={state.PersonalPhone.value} name="PersonalPhone" onBlur={handleOnBlur} autoComplete="personalEmail" onChange={handleOnChange} />
                            {state.PersonalPhone.error && <p style={errorStyle}>{state.PersonalPhone.error}</p>}
                        </Grid> 
                    </Grid>
                    <Button type="submit"  className="marginTop16" variant="contained" disabled={disable} color="primary">Submit</Button>
                </form>
            </div>
        </Container>
    );
};
export default EmployeeDetails;