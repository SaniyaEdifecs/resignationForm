import * as React from 'react';
import useForm from '../UseForm';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Button, TextField, Grid, Container, Select, MenuItem, FormControl, Breadcrumbs, Link, makeStyles, InputLabel, Typography, Collapse, IconButton } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { sp, ItemAddResult } from '@pnp/sp';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { useEffect, useState, useRef } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import * as strings from 'ResignationFormWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

const ResignationForm = (props) => {
    const resignationReasonList = ['Personal', 'Health', 'Better Opportunity', 'US Transfer', 'RG Transfer', 'Higher Education', 'Other'];
    // Define your state schema
    const [isdisable, setDisable] = useState(false);
    const [open, setOpen] = useState(false);
    const [scrollTop, setScrollTop] = useState(false);
    const scrollDiv = useRef(null);
    let isResignationOwner: boolean = false;
    // const [LastWorkingDate, setLastWorkingDate] = useState(null);
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
    const formFields = [
        "EmployeeCode",
        "FirstName",
        "LastName",
        "WorkEmail",
        // "PersonalEmail",
        "LastWorkingDate",
        "ResignationReason",
        "OtherReason",
        "Department",
        "JobTitle",
        "ManagerFirstName",
        "ManagerLastName",
        "ManagerEmail",
        "ResignationSummary",
    ];

    var stateSchema = {};
    var validationStateSchema = {};
    let selectedOption = 0;
    formFields.forEach(formField => {
        stateSchema[formField] = {};
        validationStateSchema[formField] = {};
        if (formField === "LastWorkingDate") {
            stateSchema[formField].value = new Date();
        } else {
            stateSchema[formField].value = "";
        }
        stateSchema[formField].error = "";


        if (formField === 'OtherReason') {
            validationStateSchema[formField].required = false;
        } else {
            validationStateSchema[formField].required = true;
        }

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
        setState(prevState => ({ ...prevState, ['LastWorkingDate']: ({ value: event, error: "" }) }));
        // console.log("=======", LastWorkingDate);
    };
    const getPeoplePickerItems = (items) => {
        if (items[0]) {
            setIsDirty(true);
            let peoplePickerValue = items[0];
            let fullName = peoplePickerValue.text.split(' ');
            let mFirstName = fullName[0];
            let mLastName = fullName[fullName.length - 1];
            let mEmail = peoplePickerValue.secondaryText;
            setState(prevState => ({ ...prevState, ['ManagerFirstName']: ({ value: mFirstName, error: "" }), ['ManagerLastName']: ({ value: mLastName, error: "" }), ['ManagerEmail']: ({ value: mEmail, error: "" }) }));
        }
        else {
            setState(prevState => ({ ...prevState }));
        }
    };

    const _getPeoplePickerItems = (items) => {
        if (items[0]) {
            setIsDirty(true);
            let peoplePickerValue = items[0];
            let fullName = peoplePickerValue.text.split(' ');
            let eFirstName = fullName[0];
            let eLastName = fullName[fullName.length - 1];
            let eEmail = peoplePickerValue.secondaryText;
            setState(prevState => ({ ...prevState, ['FirstName']: ({ value: eFirstName, error: "" }), ['LastName']: ({ value: eLastName, error: "" }), ['WorkEmail']: ({ value: eEmail, error: "" }), ['ID']: ({ value: peoplePickerValue.id, error: "" }) }));
        }
        else {
            setState(prevState => ({ ...prevState, ['FirstName']: ({ value: "", error: "" }), ['LastName']: ({ value: "", error: "" }), ['WorkEmail']: ({ value: "", error: "" }), ['ID']: ({ value: "", error: "" }) }));
        }
    };


    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };

    const checkResignationOwner = () => {
        sp.web.currentUser.groups.get().then((groupAccess: any) => {
            groupAccess.forEach(groupName => {
                if (groupName.Title === "Resignation  Owners") {
                    isResignationOwner = true;
                    setDisable(false);
                }
                else {
                    isResignationOwner = false;
                    setDisable(true);
                }
            });
            console.log('owners', isResignationOwner);

            return isResignationOwner;
        });
    }
        ;
    const getEmployeeResignationDetails = (employeeID) => {
        sp.web.lists.getByTitle("ResignationList").items.getById(employeeID).get().then((detail: any) => {
            formFields.forEach(formField => {
                stateSchema[formField].value = detail[formField] + "";
            });
            setState(prevState => ({ ...prevState, stateSchema }));
            checkResignationOwner();
        });
    };
    useEffect(() => {
        if (props.props) {
            getEmployeeResignationDetails(props.props);
        }
    }, []);

    useEffect(() => {
        validationStateSchema['OtherReason'].required = state.ResignationReason.value === 'Other';

        if (validationStateSchema['OtherReason'].required && !state.OtherReason.value) {
            if (state.OtherReason.error === '') {
                setState(prevState => ({
                    ...prevState,
                    ['OtherReason']: { value: '', error: 'This field is required' }
                }));
            }
        } else {
            if (state.OtherReason.error !== '') {
                setState(prevState => ({
                    ...prevState,
                    ['OtherReason']: { value: '', error: '' }
                }));
            }
        }
    }, [state]);

    const addListItem = (elements) => {
        let ID = props.props;
        elements = { ...elements, EmployeeName: state.FirstName + " " + state.LastName, ManagerName: state.ManagerFirstName + " " + state.ManagerLastName };
        let list = sp.web.lists.getByTitle("ResignationList");
        if (ID) {
            elements = { ...elements, 'ID': ID }; // remove ID
            list.items.getById(ID).update(elements).then(response => {
                window.scrollTo(0, 0);
                setState(stateSchema);
                setOpen(true);
                setTimeout(() => { setOpen(false) }, 3000);
            });
        } else {
            elements = { ...elements, 'Status': 'In Progress' };
            list.items.add(elements).then((response: ItemAddResult): void => {
                let item = response.data;
                if (item) {

                    sp.web.lists.getByTitle("ItClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((itResponse: ItemAddResult) => {
                    });
                    sp.web.lists.getByTitle("ManagersClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started", ManagerEmail: elements.ManagerEmail }).then((mngResponse: ItemAddResult) => {

                    });
                    sp.web.lists.getByTitle("OperationsClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((OpsResponse: ItemAddResult) => {

                    });
                    sp.web.lists.getByTitle("Finance%20Clearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((finResponse: ItemAddResult) => {

                    });
                    sp.web.lists.getByTitle("SalesForceClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((sfResponse: ItemAddResult) => {
                    });
                    sp.web.lists.getByTitle("HrClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((hrResponse: ItemAddResult) => {
                    });
                    sp.web.lists.getByTitle("Employee%20Details").items.add({ EmployeeNameId: item.ID, EmployeeCode: elements.EmployeeCode, FirstName: elements.FirstName, LastName: elements.LastName, LastWorkingDate: elements.LastWorkingDate, WorkEmail: elements.WorkEmail }).then((emplResponse: ItemAddResult) => {
                    });
                    scrollToRef(scrollDiv);
                    setState(stateSchema);
                    setOpen(true);


                    // window.location.href = "?component=resignationDashboard";
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        }
    };

    function onSubmitForm(value) {
        for (const key in value) {
            value[key] = value[key].value;
        }
        addListItem(value);
    }

    const redirectHome = (url, userId) => {
        event.preventDefault();
        if (userId) {
            window.location.href = "?component=" + url + "&userId=" + userId;
        } else {
            window.location.href = strings.RootUrl + url;
        }
    };



    const scrollToRef = (ref) => {
        console.log("scrolled");

        window.scrollTo(0, ref.current.offsetTop);
        setTimeout(() => { setOpen(false); }, 3000);
    };
    const classes = useStyles(0);
    return (
        <Container component="main" className="marginBottom16 root removeBoxShadow">
            <div ref={scrollDiv}>
                <Collapse in={open} >
                    <Alert action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    } severity="success">Form Submitted Successfully!</Alert>
                </Collapse>
            </div>
            <div className="">
                <Typography variant="h5" component="h3">
                    Clearance Form
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                    <Link color="inherit" onClick={() => redirectHome("/", "")} className={classes.link}>
                        <HomeIcon className={classes.icon} /> {strings.Home}
                    </Link>
                    <Typography color="textPrimary">Clearance Form</Typography>
                </Breadcrumbs>
                <form onSubmit={handleOnSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" placeholder="Type a number" type="number" margin="normal" required fullWidth disabled={isdisable} label="Employee Code" value={state.EmployeeCode.value} name="EmployeeCode" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} helperText="Please write code as written on pay slip" autoFocus />
                            {state.EmployeeCode.error && <p style={errorStyle}>{state.EmployeeCode.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <PeoplePicker context={props.context} defaultSelectedUsers={[state.WorkEmail.value]} ensureUser={true} titleText="Employee Name" isRequired={true} errorMessage="This field is required." personSelectionLimit={1} showtooltip={true} selectedItems={_getPeoplePickerItems} showHiddenInUI={false} principalTypes={[PrincipalType.User]} resolveDelay={100} />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth disabled={isdisable}
                                label="First Name" value={state.FirstName.value} name="FirstName" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.FirstName.error && <p style={errorStyle}>{state.FirstName.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" disabled={isdisable} margin="normal" required fullWidth label="Last Name" value={state.LastName.value} name="LastName" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.LastName.error && <p style={errorStyle}>{state.LastName.error}</p>}
                        </Grid>
                    </Grid>
                    {/* <Hidden xsUp>
                        <TextField variant="outlined" margin="normal" fullWidth label="ID" value={state.ID.value} name="ID" onBlur={handleOnBlur} onChange={handleOnChange} />
                    </Hidden> */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Work Email" disabled={isdisable}
                                value={state.WorkEmail.value} name="WorkEmail" autoComplete="WorkEmail" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.WorkEmail.error && <p style={errorStyle}>{state.WorkEmail.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                <KeyboardDatePicker label="Last Working Date" className="fullWidth" format="MM-dd-yyyy"
                                    value={state.LastWorkingDate.value} name="LastWorkingDate" onChange={handleDateChange} />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        {/* <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Personal Email" value={state.PersonalEmail.value} name="PersonalEmail" onBlur={handleOnBlur} autoComplete="personalEmail" onChange={handleOnChange} />
                            {state.PersonalEmail.error && <p style={errorStyle}>{state.PersonalEmail.error}</p>}
                        </Grid> */}
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" className="fluid MuiFormControl-marginNormal">
                                <InputLabel htmlFor="reason">Reason for Resignation</InputLabel>
                                <Select defaultValue={resignationReasonList[selectedOption]} value={state.ResignationReason.value} id="reason" onChange={handleOnChange} onBlur={handleOnChange} disabled={isdisable} name="ResignationReason"  >
                                    {resignationReasonList.map((list, index) => <MenuItem key={index} value={list}>{list}</MenuItem>)}
                                </Select>
                            </FormControl>
                            {state.ResignationReason.error && <p style={errorStyle}>{state.ResignationReason.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" fullWidth label="Specify(If other is selected)" disabled={isdisable} required={state.ResignationReason.value === 'Other'} value={state.OtherReason.value} name="OtherReason" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.OtherReason.error && <p style={errorStyle}>{state.OtherReason.error}</p>}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Department" disabled={isdisable}
                                value={state.Department.value} name="Department" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.Department.error && <p style={errorStyle}>{state.Department.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Title" disabled={isdisable}
                                value={state.JobTitle.value} name="JobTitle" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.JobTitle.error && <p style={errorStyle}>{state.JobTitle.error}</p>}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item sm={4}>
                            <PeoplePicker context={props.context} disabled={isdisable} defaultSelectedUsers={[state.ManagerEmail.value]} ensureUser={true} titleText="Manager Name" isRequired={true} errorMessage="This field is required." personSelectionLimit={1} showtooltip={true} selectedItems={getPeoplePickerItems} showHiddenInUI={false}
                                principalTypes={[PrincipalType.User]} resolveDelay={100} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="First Name" value={state.ManagerFirstName.value} onChange={handleOnChange} onBlur={handleOnBlur} disabled={isdisable} name="ManagerFirstName" />
                            {state.ManagerFirstName.error && <p style={errorStyle}>{state.ManagerFirstName.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" disabled={isdisable} value={state.ManagerLastName.value} onChange={handleOnChange} onBlur={handleOnBlur} name="ManagerLastName" autoComplete="lastName" />
                            {state.ManagerLastName.error && <p style={errorStyle}>{state.ManagerLastName.error}</p>}

                        </Grid>
                    </Grid>

                    <TextField disabled={isdisable} variant="outlined" margin="normal" required fullWidth label="Manager Email" value={state.ManagerEmail.value} onChange={handleOnChange} onBlur={handleOnBlur} name="ManagerEmail" />
                    {state.ManagerEmail.error && <p style={errorStyle}>{state.ManagerEmail.error}</p>}

                    <TextField id="outlined-textarea" disabled={isdisable} className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Resignation Summary" name="ResignationSummary" required value={state.ResignationSummary.value} placeholder="Resignation Summary" multiline margin="normal" variant="outlined" onChange={handleOnChange} onBlur={handleOnBlur} />
                    {state.ResignationSummary.error && <p style={errorStyle}>{state.ResignationSummary.error}</p>}

                    <Button type="submit" className="marginTop16" variant="contained" disabled={disable} color="primary">Submit</Button>
                </form>
            </div>
        </Container>
    );
}
export default ResignationForm;