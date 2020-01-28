import * as React from 'react';
import useForm from '../UseForm';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Button, TextField, Grid, Container, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker } from '@material-ui/pickers';
// import { InputProps as MuiInputProps } from '@material-ui';
import MaskedInput from 'react-text-mask';
import { sp, ItemAddResult } from '@pnp/sp';
import { useEffect, useState } from 'react';
import { element } from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';

const EmployeeDetails = (props) => {
    // Define your state schema
    const [employeeNameId, setEmployeeNameId] = useState();
    const formFields = [
        "EmployeeCode",
        "FirstName",
        "LastName",
        "PersonalEmail",
        "PersonalPhone",
        "LastWorkingDate",
        "ResignationDate",
        "Location"
    ];
    const mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    var stateSchema = {};
    var validationStateSchema = {};
    formFields.forEach(formField => {
        stateSchema[formField] = {};

        validationStateSchema[formField] = {};
        if (formField === "ResignationDate") {
            stateSchema[formField].value = new Date();
        } else {
            stateSchema[formField].value = "";
        }
        stateSchema[formField].error = "";
        validationStateSchema[formField].required = true;
        validationStateSchema[formField].validator = {
            regex: '',
            error: ''
        };

    });

    const handleDateChange = (event) => {
        setState(prevState => ({ ...prevState, ['ResignationDate']: ({ value: event, error: "" }) }));
        // console.log("=======", LastWorkingDate);
    };
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
        else {
            setState(prevState => ({ ...prevState, ['FirstName']: ({ value: "", error: "" }), ['LastName']: ({ value: "", error: "" }), }));
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
            console.log("detail", detail);
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
        console.log("==", elements);
        let ID = props.props;
        let list = sp.web.lists.getByTitle("Employee%20Details");
        if (ID) {
            list.items.getById(ID).update(elements).then(item => {
                sp.web.lists.getByTitle("ResignationList").items.getById(employeeNameId).update({ 'PersonalEmail': elements.PersonalEmail, 'ResignationDate': elements.ResignationDate, 'Location': elements.Location }).then(response => {
                });
                setState(stateSchema);
                // window.location.href = "?component=employeeDashboard";
                //  redirect to dashboard
            });
        }
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
                    Employee Details
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
                            <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" value={state.LastName.value} name="LastName" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.LastName.error && <p style={errorStyle}>{state.LastName.error}</p>}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                <KeyboardDatePicker label="Last Working Date" className="fullWidth" format="MM-dd-yyyy"
                                    value={state.LastWorkingDate.value} name="LastWorkingDate" onChange={handleDateChange} />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                <KeyboardDatePicker label="Resignation Date" className="fullWidth" format="MM-dd-yyyy"
                                    value={state.ResignationDate.value} name="ResignationDate" onChange={handleDateChange} autoFocus/>
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Personal Email" value={state.PersonalEmail.value} name="PersonalEmail" onBlur={handleOnBlur} autoComplete="personalEmail" onChange={handleOnChange} />
                            {state.PersonalEmail.error && <p style={errorStyle}>{state.PersonalEmail.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* <TextField variant="outlined" margin="normal" required fullWidth label="Personal Phone" value={state.PersonalPhone.value} name="PersonalPhone" onBlur={handleOnBlur} autoComplete="personalEmail" onChange={handleOnChange} /> */}
                            <TextField variant="outlined" margin="normal" required fullWidth label="Personal Phone" name="PersonalPhone" onBlur={handleOnBlur} autoComplete="personalEmail" onChange={handleOnChange} InputProps={{ inputComponent: MaskedInput, }} inputProps={{ guide: false, mask, placeholderChar: '\u2000', }}
                                type="tel" value={state.PersonalPhone.value} />
                            {state.PersonalPhone.error && <p style={errorStyle}>{state.PersonalPhone.error}</p>}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Location" value={state.Location.value} name="Location" onBlur={handleOnBlur} autoComplete="Location" onChange={handleOnChange} />
                            {state.Location.error && <p style={errorStyle}>{state.Location.error}</p>}
                        </Grid>
                    </Grid>

                    <Button type="submit" className="marginTop16" variant="contained" disabled={disable} color="primary">Submit</Button>
                </form>
            </div>
        </Container>
    );
};
export default EmployeeDetails;