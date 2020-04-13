import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, Container, Grid, Breadcrumbs, Link, makeStyles } from '@material-ui/core';
import { sp } from '@pnp/sp';
import useForm from '../UseForm';
import '../CommonStyleSheet.scss';
import * as strings from 'ResignationFormWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker } from '@material-ui/pickers';
import MaskedInput from 'react-text-mask';
import DateFnsUtils from '@date-io/date-fns';
import HomeIcon from '@material-ui/icons/Home';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import SharePointService from '../SharePointServices';

const EmployeeDetails = (props) => {
    let ID = props.Id;
    const [readOnly, setReadOnly] = useState(false);
    let currentUser: any = [];
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
        "Location",
        "WorkEmail"
    ];
    const mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    var stateSchema = {};
    var validationStateSchema = {};
    formFields.forEach(formField => {
        stateSchema[formField] = {};

        validationStateSchema[formField] = {};
        if (formField === "ResignationDate") {
            let date = new Date();
            console.log("default = ",date)
            stateSchema[formField].value =date// [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('-');
            // console.log(stateSchema[formField].value)

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
    const { state, handleOnChange, handleOnSubmit, disable, setState, handleOnBlur, setIsDirty } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );
    const handleDateChange = (event) => {
        console.log(event)
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
            // console.log(eEmail, eLastName, eFirstName);
            setState(prevState => ({ ...prevState, ['FirstName']: ({ value: eFirstName, error: "" }), ['LastName']: ({ value: eLastName, error: "" }) }));
        }
        else {
            setState(prevState => ({ ...prevState, ['FirstName']: ({ value: "", error: "" }), ['LastName']: ({ value: "", error: "" }), }));
        }
    };


    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };

    const getEmployeeDetails = (clearanceId) => {
        sp.web.lists.getByTitle("Employee%20Details").items.getById(clearanceId).get().then((detail: any) => {
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
    const setEditAccessPermissions = () => {
        sp.web.currentUser.get().then((response) => {
            currentUser = response;
            if (currentUser) {
                const url = props.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Employee%20Details')/items(" + ID + ")/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
                props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
                    .then((response: SPHttpClientResponse): Promise<any> => {
                        return response.json();
                    }).then(permissionResponse => {
                        console.log("permissions reponse", permissionResponse);
                        let permissionLevel = permissionResponse;
                        if (permissionLevel.High == 2147483647 && permissionLevel.Low == 4294705151) {
                            setReadOnly(false);
                        } else if (permissionLevel.High == 48 && permissionLevel.Low == 134287360) {
                            setReadOnly(true);
                        } else if (permissionResponse.error) {
                            console.log(permissionResponse.error);
                            setReadOnly(true);
                        }
                    });

            }
        });
    }
    useEffect(() => {
        if (props) {
            getEmployeeDetails(ID);
        }
        setEditAccessPermissions();
    }, []);

    const addListItem = (elements) => {
        let list = sp.web.lists.getByTitle("Employee%20Details");
        if (ID) {
            list.items.getById(ID).update(elements).then(item => {
                sp.web.lists.getByTitle("ResignationList").items.getById(employeeNameId).update({ 'PersonalEmail': elements.PersonalEmail, 'ResignationDate': elements.ResignationDate, 'Location': elements.Location, 'emplStatus': 'Approved' }).then(response => {
                });
                if (item) {
                    window.location.href = "?component=resignationDetail&resignationId=" + employeeNameId;
                    //   getEmployeeDetails(ID);
                }
            });
        }
    };

    function onSubmitForm(value) {
        for (const key in value) {
            value[key] = value[key].value;
        }
        addListItem(value);
    }
    const redirectHome = (url, resignationId) => {
        event.preventDefault();
        if (resignationId) {
            window.location.href = "?component=" + url + "&resignationId=" + resignationId;
        } else {
            window.location.href = url;
        }
    };
    const useStyles = makeStyles(theme => ({
        link: {
            display: 'flex',
        },
        icon: {
            marginRight: theme.spacing(0.5),
            width: 20,
            height: 20,
        },
    }));
    const classes = useStyles(0);
    return (
        <Container component="main" className="root removeBoxShadow">
            <div className="">
                <Typography variant="h5" component="h3">
                    {strings.EmployeDetails}
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                    <Link color="inherit" onClick={() => redirectHome(strings.HomeUrl, "")} className={classes.link}>
                        <HomeIcon className={classes.icon} /> {strings.Home}
                    </Link>
                    <Typography color="textPrimary">Employee Details</Typography>
                </Breadcrumbs>
                <form onSubmit={handleOnSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Employee Code" value={state.EmployeeCode.value} name="EmployeeCode" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} helperText="Please write code as written on pay slip" />
                            {state.EmployeeCode.error && <p style={errorStyle}>{state.EmployeeCode.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <PeoplePicker context={props.context} defaultSelectedUsers={[state.WorkEmail.value]} ensureUser={true} titleText="Employee Name" isRequired={true} errorMessage="This field is required." personSelectionLimit={1} showtooltip={true} selectedItems={_getPeoplePickerItems} showHiddenInUI={false} principalTypes={[PrincipalType.User]} resolveDelay={100} />
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
                                    value={state.ResignationDate.value} name="ResignationDate" onChange={handleDateChange} />
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

                    <Button type="submit" className="marginTop16" variant="contained" disabled={disable || readOnly} color="primary">Submit</Button>
                </form>
            </div>
        </Container>
    );
};
export default EmployeeDetails;