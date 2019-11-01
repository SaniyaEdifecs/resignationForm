import * as React from 'react';
import useForm from '../UseForm';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Button, TextField, Grid, Container, Select, MenuItem, FormControl, InputLabel, Typography } from '@material-ui/core';
import { sp, ItemAddResult } from '@pnp/sp';
import { useEffect, useState } from 'react';


const ResignationForm = (props) => {
    const resignationReasonList = ['Personal', 'Health', 'Better Opportunity', 'US Transfer', 'RG Transfer', 'Higher Education', 'Other'];
    // Define your state schema
    const [isdisable, setDisable] = useState(false);
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
        "ResignationSummary",
        "ID"
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

    function onSubmitForm(state) {

        for (const key in state) {
            state[key] = state[key].value;
        }
        console.log(state);
        addListItem(state);
    }

    const getEmployeeResignationDetails = (employeeID) => {
        sp.web.lists.getByTitle("ResignationList").items.getById(employeeID).get().then((detail: any) => {
            console.log("\n\n\nemployee regignation details - \n\n\n", detail);
            formFields.forEach(formField => {
                stateSchema[formField].value = detail[formField] + "";
            });
            setState(prevState => ({ ...prevState, stateSchema }));

            setDisable(true);
            console.log("\n\n\nstateSchema - \n\n\n", stateSchema);
        });
    }
    useEffect(() => {
        if (props.props) {
            getEmployeeResignationDetails(props.props);
        }
    }, []);

    const addListItem = (elements) => {
        let userId = props.props;
        elements = {...elements, EmployeeName:state.WorkEmail, ManagerName: state.ManagerEmail };
        let list = sp.web.lists.getByTitle("ResignationList");
        // console.log("elemets====", elements);
        if (userId) {
            elements = { ...elements, 'ID': userId };
            list.items.getById(userId).update(elements).then(response => {
                console.log("updated", response);
                setState(stateSchema);
            });
        } else {
            list.items.add(elements).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    console.log("added", elements);
                    setState(stateSchema);
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        }
    };
    const { state, handleOnChange, handleOnSubmit, disable, setState, handleOnBlur, getPeoplePickerItems, _getPeoplePickerItems } = useForm(
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
            <Typography variant="h5" component="h3">
                Resignation Form
            </Typography>
            <div>
                <form onSubmit={handleOnSubmit}>
                    <TextField variant="outlined" margin="normal" required fullWidth disabled={isdisable} label="Employee Code" value={state.EmployeeCode.value} name="EmployeeCode" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} helperText="Please write code as written on play slip" />
                    {state.EmployeeCode.error && <p style={errorStyle}>{state.EmployeeCode.error}</p>}
                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                        <PeoplePicker context={props.context} defaultSelectedUsers={[state.WorkEmail.value]} ensureUser={true} titleText="Employee Name" isRequired={true} errorMessage="This field is required." personSelectionLimit={1} showtooltip={true} selectedItems={_getPeoplePickerItems} showHiddenInUI={false} principalTypes={[PrincipalType.User]} resolveDelay={100} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth disabled={isdisable}
                                label="First Name" value={state.FirstName.value} name="FirstName" autoComplete="off" onBlur={handleOnBlur} onChange={handleOnChange} />
                            {state.FirstName.error && <p style={errorStyle}>{state.FirstName.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" disabled={isdisable} margin="normal" required fullWidth label="Last Name" onBlur={handleOnBlur} value={state.LastName.value}
                                name="LastName" autoComplete="off" onChange={handleOnChange} />
                            {state.LastName.error && <p style={errorStyle}>{state.LastName.error}</p>}
                        </Grid>
                    </Grid>
                    <TextField variant="outlined" margin="normal" fullWidth label="ID" value={state.ID.value} name="ID" onBlur={handleOnBlur} onChange={handleOnChange} />
                    <TextField variant="outlined" margin="normal" required fullWidth label="Work Email" disabled={isdisable}
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

                    <TextField variant="outlined" margin="normal" fullWidth label="Specify(If other is selected)" disabled={isdisable}
                        value={state.OtherReason.value} name="OtherReason" onChange={handleOnChange} onBlur={handleOnBlur} />
                    {state.OtherReason.error && <p style={errorStyle}>{state.OtherReason.error}</p>}

                    <TextField variant="outlined" margin="normal" required fullWidth label="Department" disabled={isdisable}
                        value={state.Department.value} name="Department" onChange={handleOnChange} onBlur={handleOnBlur} />
                    {state.Department.error && <p style={errorStyle}>{state.Department.error}</p>}

                    <TextField variant="outlined" margin="normal" required fullWidth label="Title" disabled={isdisable}
                        value={state.JobTitle.value} name="JobTitle" onChange={handleOnChange} onBlur={handleOnBlur} />
                    {state.JobTitle.error && <p style={errorStyle}>{state.JobTitle.error}</p>}

                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                            <PeoplePicker context={props.context} disabled={isdisable} defaultSelectedUsers={[state.ManagerEmail.value]} ensureUser={true} titleText="Manager Name" isRequired={true} errorMessage="This field is required." personSelectionLimit={1} showtooltip={true} selectedItems={getPeoplePickerItems} showHiddenInUI={false}
                                principalTypes={[PrincipalType.User]} resolveDelay={100} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="First Name" value={state.ManagerFirstName.value} disabled={isdisable} name="ManagerFirstName" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.ManagerFirstName.error && <p style={errorStyle}>{state.ManagerFirstName.error}</p>}

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" disabled={isdisable} value={state.ManagerLastName.value} name="ManagerLastName" autoComplete="lastName" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.ManagerLastName.error && <p style={errorStyle}>{state.ManagerLastName.error}</p>}

                        </Grid>
                    </Grid>

                    <TextField disabled={isdisable} variant="outlined" margin="normal" required fullWidth label="Manager Email" value={state.ManagerEmail.value} name="ManagerEmail" onChange={handleOnChange} onBlur={handleOnBlur} />
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