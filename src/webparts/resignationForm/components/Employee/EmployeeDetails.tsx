import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, Container, Grid, Breadcrumbs, Link, makeStyles, Backdrop, CircularProgress, Snackbar } from '@material-ui/core';
import * as strings from 'ResignationFormWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker } from '@material-ui/pickers';
import MaskedInput from 'react-text-mask';
import DateFnsUtils from '@date-io/date-fns';
import HomeIcon from '@material-ui/icons/Home';
import { Alert } from '@material-ui/lab';
import { PeoplePicker, PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import SharePointService from '../SharePointServices';
import resignationUseForm from '../Resignations/ResignationUseForm';
import '../CommonStyleSheet.scss';

const EmployeeDetails = (props) => {
    let ID = props.Id;
    const [readOnly, setReadOnly] = useState(false);
    const [showMsg, setShowMsg] = useState(false);
    const [open, setOpen] = useState(false);
    const [loader, showLoader] = useState(false);
    const [buttonVisibility, setButtonVisibility] = useState(true);
    let currentUser: any = [];
    // Define your state schema
    const [employeeNameId, setEmployeeNameId] = useState();
    const formFields = ["EmployeeCode", "FirstName", "LastName", "PersonalEmail", "PersonalPhone", "LastWorkingDate", "ResignationDate", "Location", "WorkEmail"];
    const mask = [/[1-9]/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    var stateSchema = {};
    var validationStateSchema = {};
    formFields.forEach(formField => {
        stateSchema[formField] = {};
        validationStateSchema[formField] = {};
        stateSchema[formField].value = "";
        stateSchema[formField].error = "";
        validationStateSchema[formField].required = true;
        validationStateSchema[formField].validator = {
            regex: '',
            error: ''
        };
    });
    const { state, handleOnChange, handleOnSubmit, disable, setState, handleOnBlur, setIsDirty } = resignationUseForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );
    const handleDateChange = (event) => {
        setState(prevState => ({ ...prevState, ['ResignationDate']: ({ value: event, error: "" }) }));
    };
    const _getPeoplePickerItems = (items) => {
        if (items[0]) {
            setIsDirty(true);
            let peoplePickerValue = items[0];
            let fullName = peoplePickerValue.text.split(' ');
            let eFirstName = fullName[0];
            let eLastName = fullName[fullName.length - 1];
            let eEmail = peoplePickerValue.secondaryText;
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
    const getStatusDetails = (status) => {
        switch (status) {
            case "null" || "Not Started" || "Pending":
                setButtonVisibility(true);
                break;
            case "Approved":
                setReadOnly(true);
                setButtonVisibility(false);
                setEditAccessPermissions('Approved');
                break;
            case "Canceled":
                setShowMsg(true);
                setEditAccessPermissions('Canceled');
                break;
            default:
                setButtonVisibility(true);
                break;
        }
    };

    const getEmployeeDetails = (clearanceId) => {
        SharePointService.getListByTitle("Employee%20Details").items.getById(clearanceId).get().then((detail: any) => {
            console.log("detail", detail);
            setEmployeeNameId(detail.EmployeeNameId);
            getStatusDetails(detail.Status);
            formFields.forEach(formField => {
                if (detail[formField] == null) {
                    stateSchema[formField].value = "";
                    stateSchema[formField].error = "";
                    if (detail['ResignationDate'] == null) {
                        stateSchema['ResignationDate'].value = new Date();
                        stateSchema['ResignationDate'].error = "";
                    }
                } else {
                    stateSchema[formField].value = detail[formField] + "";
                    stateSchema[formField].error = "";
                }
            });
            setState(prevState => ({ ...prevState, stateSchema }));
            // setDisable(true);
        });
    };
    const setEditAccessPermissions = (statusValue) => {
        SharePointService.getCurrentUser().then((response) => {
            currentUser = response;
            if (currentUser) {
                const url = props.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Employee%20Details')/items(" + ID + ")/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
                props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
                    .then((response: SPHttpClientResponse): Promise<any> => {
                        return response.json();
                    }).then(permissionResponse => {
                        // console.log("permissions reponse", permissionResponse);
                        let permissionLevel = permissionResponse;
                        if (statusValue == 'Approved' || statusValue == 'Canceled') {
                            SharePointService.getCurrentUserGroups().then((groups: any) => {
                                let isGroupOwner = groups.filter(group => group.Title === "Resignation Group - Owners").length;
                                setButtonVisibility(isGroupOwner?true:false);
                                if (statusValue == 'Approved') {
                                    setReadOnly(isGroupOwner ? false : true);
                                } else {
                                    setReadOnly(isGroupOwner ? true : false);
                                }
                            });
                        } else {
                            if (permissionLevel.High == 2147483647 && permissionLevel.Low == 4294705151) {
                                setReadOnly(false);
                            } else if (permissionResponse.error ||
                                // (permissionLevel.High == 176 && permissionLevel.Low == 138612833) ||
                                (permissionLevel.High == 48 && permissionLevel.Low == 134287360)) {
                                console.log("permissionResponse.error:", permissionResponse.error);
                                setReadOnly(true);
                            }
                        }

                    });

            }
        });
    };
    useEffect(() => {
        if (props) {
            getEmployeeDetails(ID);
        }
    }, []);

    const addListItem = (elements) => {
        elements = { ...elements, 'Status': 'Approved' };
        if (ID) {
            SharePointService.getListByTitle("Employee%20Details").items.getById(ID).update(elements).then(item => {
                SharePointService.getListByTitle("ResignationList").items.getById(employeeNameId).update({ 'PersonalEmail': elements.PersonalEmail, 'ResignationDate': elements.ResignationDate, 'Location': elements.Location, 'emplStatus': 'Approved', 'PersonalPhone': elements.PersonalPhone }).then(response => {
                });
                if (item) {
                    showLoader(false);
                    setOpen(true);
                    window.location.href = "?component=resignationDetail&resignationId=" + employeeNameId;


                    //   getEmployeeDetails(ID);
                }
            });
        }
    };

    function onSubmitForm(value) {
        showLoader(true);
        for (const key in value) {
            value[key] = value[key].value;
        }
        addListItem(value);
    }

    const useStyles = makeStyles(theme => ({
        link: {
            display: 'flex',
        },
        icon: {
            marginRight: theme.spacing(0.5),
            width: 20,
            height: 20,
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }));
    const classes = useStyles(0);
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    // Backdrop
    const handleBackdropClose = () => {
        showLoader(false);
    };

    return (
        <div>
            <Backdrop className={classes.backdrop} open={loader} onClick={handleBackdropClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Form Submitted Successfully!
                    </Alert>
            </Snackbar>
            <Container component="main" className="root removeBoxShadow">
                <div className="">
                    <Typography variant="h5" component="h3">
                        {strings.EmployeDetails}
                    </Typography>
                    <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                        <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                            <HomeIcon className={classes.icon} /> {strings.Home}
                        </Link>
                        <Typography color="textPrimary">Employee Details</Typography>
                    </Breadcrumbs>
                    {showMsg && <div >
                        <Alert severity="warning" className="marginTop16">This resignation is withdrawn - No Action Required!</Alert>
                    </div>}
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
                                    <KeyboardDatePicker label="Last Working Date" className="fullWidth" format="dd-MM-yyyy"
                                        value={state.LastWorkingDate.value} name="LastWorkingDate" onChange={handleDateChange} />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                    <KeyboardDatePicker label="Resignation Date" className="fullWidth" format="dd-MM-yyyy" value={state.ResignationDate.value} name="ResignationDate" onChange={handleDateChange} />
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
                                <TextField variant="outlined" margin="normal" required fullWidth label="Personal Phone" name="PersonalPhone" onBlur={handleOnBlur} autoComplete="personalEmail" onChange={handleOnChange} InputProps={{ inputComponent: MaskedInput, }} inputProps={{ guide: false, mask, placeholderChar: '\u2000'}}
                                    type="tel" value={state.PersonalPhone.value} />
                                {state.PersonalPhone.error && <p style={errorStyle}>{state.PersonalPhone.error}</p>}
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField variant="outlined" margin="normal" required fullWidth label="Address Details " value={state.Location.value} name="Location" onBlur={handleOnBlur} autoComplete="Location" onChange={handleOnChange} />
                                {state.Location.error && <p style={errorStyle}>{state.Location.error}</p>}
                            </Grid>
                        </Grid>
                        {buttonVisibility ?
                            <Button type="submit" className="marginTop16" variant="contained" disabled={disable || readOnly} color="primary">Submit</Button>
                            : null}
                    </form>
                </div>
            </Container>
        </div>
    );
};
export default EmployeeDetails;