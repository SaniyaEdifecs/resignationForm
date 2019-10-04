import * as React from 'react';
import useForm from './useForm';

import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Button, CssBaseline, TextField, Grid, Typography, Container, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { sp, ItemAddResult } from '@pnp/sp';


const ResignationForm = (props) => {
    const resignationReasonList = ['Personal', 'Health', 'Better Oppertunity', 'US Transfer', 'RG Transfer', 'Higher Education', 'Other'];

    // Define your state schema
    const formFields = [
        "EmployeeCode",
        "FirstName",
        "LastName",
        "WorkEmail",
        "PersonalEmail",
        "ResignationReason",
        "OtherReason",
        "Department",
        "JobTitle",
        "ManagerFirstName",
        "ManagerLastName",
        "ManagerEmail",
        "ResignationSummary"
    ];
    var stateSchema = {     
    };
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


    function onSubmitForm(state) {

        for (const key in state) {
             state[key] = state[key] .value;
        }
        console.log(state);
        addListItem(state);
    }

    const addListItem = (elements) => {
        sp.web.lists.getByTitle("ResignationList").items.add(elements).then((response: ItemAddResult): void => {
            const item = response.data as string;
            if (item) {
                console.log('submitted', item);

                //send email 
                // sp.utility.sendEmail(emailProps).then(response => {
                //     console.log("Email Sent!", response);
                // });
            }
        }, (error: any): void => {
            console.log('Error while creating the item: ' + error);
        });
    };
    const { state, handleOnChange, handleOnSubmit, disable, handleOnBlur, getPeoplePickerItems } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );
    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };
    return (
        <Container component="main" maxWidth="xs">
            <div>
                <form onSubmit={handleOnSubmit}>
                    <TextField variant="outlined" margin="normal" autoFocus required fullWidth label="Employee Code"
                        value={state.EmployeeCode.value} name="EmployeeCode" autoComplete="off"
                        onChange={handleOnChange} onBlur={handleOnBlur} helperText="Please write code as written on play slip" />
                    {state.EmployeeCode.error && <p style={errorStyle}>{state.EmployeeCode.error}</p>}

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth
                                label="First Name" value={state.FirstName.value} name="FirstName" autoComplete="off" onBlur={handleOnBlur} onChange={handleOnChange} />
                            {state.FirstName.error && <p style={errorStyle}>{state.FirstName.error}</p>}

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" onBlur={handleOnBlur} value={state.LastName.value}
                                name="LastName" autoComplete="off" onChange={handleOnChange} />
                            {state.LastName.error && <p style={errorStyle}>{state.LastName.error}</p>}
                        </Grid>
                    </Grid>
                    <TextField variant="outlined" margin="normal" required fullWidth label="Work Email"
                        value={state.WorkEmail.value} name="WorkEmail" autoComplete="WorkEmail" onBlur={handleOnBlur} onChange={handleOnChange} />
                    {state.WorkEmail.error && <p style={errorStyle}>{state.WorkEmail.error}</p>}

                    <TextField variant="outlined" margin="normal" required fullWidth label="Personal Email" value={state.PersonalEmail.value} name="PersonalEmail" onBlur={handleOnBlur} autoComplete="personalEmail" onChange={handleOnChange} />
                    {state.PersonalEmail.error && <p style={errorStyle}>{state.PersonalEmail.error}</p>}

                    <FormControl variant="outlined" className="fullWidth">
                        <InputLabel htmlFor="reason">Reason for Resignation</InputLabel>
                        <Select value={state.ResignationReason.value} id="reason" onChange={handleOnChange} name="ResignationReason"  >
                            {resignationReasonList.map((list, index) => <MenuItem key={index} value={list}>{list}</MenuItem>)}
                        </Select>
                        {state.ResignationReason.error && <p style={errorStyle}>{state.ResignationReason.error}</p>}
                    </FormControl>

                    <TextField variant="outlined" margin="normal" fullWidth label="Specify(If other is selected)"
                        value={state.OtherReason.value || ''} name="OtherReason" onChange={handleOnChange} onBlur={handleOnBlur} />
                    {state.OtherReason.error && <p style={errorStyle}>{state.OtherReason.error}</p>}

                    <TextField variant="outlined" margin="normal" required fullWidth label="Department"
                        value={state.Department.value} name="Department" onChange={handleOnChange} onBlur={handleOnBlur} />
                    {state.Department.error && <p style={errorStyle}>{state.Department.error}</p>}

                    <TextField variant="outlined" margin="normal" required fullWidth label="Title"
                        value={state.JobTitle.value} name="JobTitle" onChange={handleOnChange} onBlur={handleOnBlur} />
                    {state.JobTitle.error && <p style={errorStyle}>{state.JobTitle.error}</p>}

                  

                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                            <PeoplePicker context={props.context} ensureUser={true} titleText="Manager Name" personSelectionLimit={1} showtooltip={true} disabled={false} selectedItems={getPeoplePickerItems} showHiddenInUI={false}
                                principalTypes={[PrincipalType.User]} isRequired={true} resolveDelay={1000} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="First Name" value={state.ManagerFirstName.value} name="ManagerFirstName" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.ManagerFirstName.error && <p style={errorStyle}>{state.ManagerFirstName.error}</p>}

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" value={state.ManagerLastName.value} name="ManagerLastName" autoComplete="lastName" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.ManagerLastName.error && <p style={errorStyle}>{state.ManagerLastName.error}</p>}

                        </Grid>
                    </Grid>

                    <TextField variant="outlined" margin="normal" required fullWidth label="Manager Email" value={state.ManagerEmail.value} name="ManagerEmail" onChange={handleOnChange} onBlur={handleOnBlur} />
                    {state.ManagerEmail.error && <p style={errorStyle}>{state.ManagerEmail.error}</p>}

                    <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Resignation Summary" name="ResignationSummary" value={state.ResignationSummary.value} placeholder="Resignation Summary" multiline margin="normal" variant="outlined" onChange={handleOnChange} onBlur={handleOnBlur} />
                    {state.ResignationSummary.error && <p style={errorStyle}>{state.ResignationSummary.error}</p>}

                    <Button type="submit" fullWidth className="marginTop16" variant="contained" disabled={disable} color="primary">Submit</Button>

                </form>
            </div>
        </Container>
    );
}
export default ResignationForm;