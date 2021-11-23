import * as React from 'react';
import resignationUseForm from './ResignationUseForm';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Button, TextField, Grid, Container, Select, MenuItem, FormControl, Breadcrumbs, Link, makeStyles, InputLabel, Typography, Snackbar, Backdrop, Checkbox, FormControlLabel } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { sp, ItemAddResult } from '@pnp/sp';
import Alert from '@material-ui/lab/Alert';
import { useEffect, useState, } from 'react';
import HomeIcon from '@material-ui/icons/Home';
import * as strings from 'ResignationFormWebPartStrings';
import SharePointService from '../SharePointServices';
import CircularProgress from '@material-ui/core/CircularProgress';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import {DateTime} from "luxon";
import * as moment from 'moment';

const ResignationForm = (props) => {

// console.log('props', props);
   
    const resignationReasonList = ['Voluntary Exit', 'Involuntary Exit', 'US Transfer'];
    const noticePeriodList = [15, 45];
    const salutation = ['Mr.', 'Ms.', 'Mrs.'];
    // const resignationReasonList = ['Personal', 'Health', 'Better Opportunity', 'US Transfer', 'RG Transfer', 'Higher Education', 'Other'];
    const [isdisable, setIsDisable] = useState(false);
    const [open, setOpen] = useState(false);
    const [loader, showLoader] = useState(false);
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
    const formFields = [
        "EmployeeCode",
        "FirstName",
        "LastName",
        "WorkEmail",
        "LastWorkingDate",
        "ResignationDate",
        "ResignationReason",
        "salutation",
        "Department",
        "JobTitle",
        "ManagerFirstName",
        "ManagerLastName",
        "ManagerEmail",
        "AccountDeactivated",
        "noticePeriod"
    ];

    var stateSchema = {};
    var validationStateSchema = {};
    let selectedOption = 0;
    formFields.forEach(formField => {
        stateSchema[formField] = {};
        validationStateSchema[formField] = {};
        if (formField === "LastWorkingDate" || formField === "ResignationDate") {
            stateSchema[formField].value = new Date();
        } else if (formField === "AccountDeactivated") {
            stateSchema[formField].value = false;
        }
        else {
            stateSchema[formField].value = "";
        }
        stateSchema[formField].error = "";
        if (formField === 'AccountDeactivated') {
            validationStateSchema[formField].required = false;
        } else {
            validationStateSchema[formField].required = true;
        }

        validationStateSchema[formField].validator = {
            regex: '',
            error: ''
        };

    });
    const { state, handleOnChange, handleOnSubmit, disable, setState, handleOnBlur, getPeoplePickerItems, setIsDirty } = resignationUseForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );
    Date.prototype["stdTimezoneOffset"] = function () {
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }
    
    Date.prototype["isDstObserved"] = function () {
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    }


    
    const handleResignationDateChange = (dateValue) => {
        let npDays = state.noticePeriod.value -1;
        console.log('date value, np',dateValue, npDays);
        const pacific = DateTime.fromObject({ year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() }, { zone: "America/Los_Angeles" });
        // let convertResignationDatetoLocalTimezone = dateValue.setHours((480 - dateValue.getTimezoneOffset()) / 60);
        // let isoResignationDate = new Date(convertResignationDatetoLocalTimezone).toISOString();
        // let isoResignationDate = new Date(dateValue).toISOString();
        let isoResignationDate = pacific.toISO();
        // console.log('Resignation date pacific =',isoResignationDate);
        setState(prevState => ({ ...prevState, ['ResignationDate']: ({ value: isoResignationDate, error: "" }) }));
        let calculatedLSWD =   new Date(dateValue.setDate(dateValue.getDate() + npDays));
        handleDateChange(calculatedLSWD);
    };

    const handleDateChange = (dateValue) => {
        // let convertLastDatetoLocalTimezone = dateValue.setHours((480 - dateValue.getTimezoneOffset()) / 60);
        // let isoLastWorkingDate = new Date(convertLastDatetoLocalTimezone).toISOString();
        // let isoLastWorkingDate = new Date(dateValue).toISOString();
        const pacific = DateTime.fromObject({ year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() }, { zone: "America/Los_Angeles" });
        let isoLastWorkingDate = pacific.toISO();

        // console.log('Last Working date pacific =',isoLastWorkingDate);
        setState(prevState => ({ ...prevState, ['LastWorkingDate']: ({ value: isoLastWorkingDate, error: "" }) }));
    };
    const handleCheckbox = (event) => {
        setState(prevState => ({ ...prevState, ['AccountDeactivated']: ({ value: event.target.checked, error: '' }) }));
    };
    const handleEmployeeCode = (event) => {
        console.log('==', event);
        let mainReg = /(^c-)?[0-9]{4}$/
        let employeeCode = event.target.value;
        if (employeeCode.toLowerCase().includes('c-')) {
            if (employeeCode.length > 6) {
                employeeCode = employeeCode.substring(0, 6);
            }
        } else {
            if (employeeCode.length > 4) {
                employeeCode = employeeCode.substring(0, 4);
            }
        }
        setState(prevState => ({
            ...prevState, ['EmployeeCode']: ({
                value: employeeCode,
                error: employeeCode && mainReg.test(employeeCode) ? "" : "Enter a valid 4 or 6 (if starts with 'C-') digit employee code."
            })
        }));
    };

    const _getPeoplePickerItems = (items) => {
        if (items[0]) {
            let url = props.context.pageContext.site.absoluteUrl + "/_api/Web/SiteUsers?$filter=Email eq '" + items[0]['secondaryText'] + "'";
            props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse): Promise<any> => {
                    return response.json();
                }).then(response => {
                    const loginName = response.value[0]['LoginName'];
                    let url2 = props.context.pageContext.site.absoluteUrl + "/_api/sp.userprofiles.peoplemanager/getpropertiesfor(@v)?@v='" + encodeURIComponent(loginName) + "'";
                    props.context.spHttpClient.get(url2, SPHttpClient.configurations.v1)
                        .then((response: SPHttpClientResponse): Promise<any> => {
                            return response.json();
                        }).then((profileProps) => {
                            let departmentDetails: any = {};
                            let managerDetails: any = {};
                            if (profileProps) {
                                let peoplePickerValue = items[0];
                                let fullName = peoplePickerValue.text.split(' ');
                                let eFirstName = fullName.shift();
                                let eLastName = fullName.pop();
                                let eEmail = peoplePickerValue.secondaryText;
                                profileProps.UserProfileProperties.map(prop => {
                                    if (prop.Key === 'Manager') {
                                        prop.Value = prop.Value.split('|').pop();
                                        managerDetails = prop;
                                    }
                                    if (prop.Key === 'Department') {
                                        departmentDetails = prop;
                                    }
                                });

                                sp.web.ensureUser(managerDetails.Value).then(({ data }) => {
                                    let name = data.Title.split(' ');
                                    managerDetails.FirstName = name.shift();
                                    managerDetails.LastName = name.pop();
                                    setState(prevState => ({
                                        ...prevState,
                                        ['FirstName']: ({ value: eFirstName, error: "" }),
                                        ['LastName']: ({ value: eLastName, error: "" }),
                                        ['WorkEmail']: ({ value: eEmail, error: "" }),
                                        // ['ID']: ({ value: peoplePickerValue.id, error: "" }),
                                        ['JobTitle']: ({ value: profileProps['Title'], error: "" }),
                                        ['Department']: ({ value: departmentDetails.Value, error: "" }),
                                        ['ManagerEmail']: ({ value: managerDetails.Value, error: "" }),
                                        ['ManagerFirstName']: ({ value: managerDetails.FirstName, error: "" }),
                                        ['ManagerLastName']: ({ value: managerDetails.LastName, error: "" })
                                    }));
                                    setIsDirty(true);

                                });


                            }
                        });
                });
        } else {
            setState(prevState => ({
                ...prevState, ['FirstName']: ({ value: "", error: "" }), ['LastName']: ({ value: "", error: "" }), ['WorkEmail']: ({ value: "", error: "" }), ['JobTitle']: ({ value: "", error: "" }), ['ManagerEmail']: ({ value: "", error: "" }), ['Department']: ({ value: "", error: "" }), ['ManagerFirstName']: ({ value: "", error: "" }), ['ManagerLastName']: ({ value: "", error: "" })
            }));
        }
    };

    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };

    const getEmployeeResignationDetails = (clearanceId) => {
        SharePointService.getListByTitle("ResignationList").items.getById(clearanceId).get().then((detail: any) => {
            console.log('details', detail);
            formFields.forEach(formField => {
                if (formField === 'AccountDeactivated') {
                    if (detail['AccountDeactivated'] === null || detail['AccountDeactivated'] === false) {
                        stateSchema['AccountDeactivated'].value = false;
                    } else { // if (detail['AccountDeactivated'] != null && detail['AccountDeactivated'] === true)
                        stateSchema['AccountDeactivated'].value = true;
                    }
                } else {
                    stateSchema[formField].value = detail[formField] + "";
                }
            });
            setState(prevState => ({ ...prevState, stateSchema }));
        });
    };

    useEffect(() => {
        if (props.props) {
            getEmployeeResignationDetails(props.props);
        }
        SharePointService.getCurrentUserGroups().then((groups: any) => {
            setIsDisable(groups.filter(groupName => groupName.Title === "Resignation Group - Owners").length ? false : true);
        });
    }, []);

    const addListItem = (elements) => {
        let ID = props.props;
        elements = { ...elements, EmployeeName: state.FirstName + " " + state.LastName, ManagerName: state.ManagerFirstName + " " + state.ManagerLastName };
        // console.log('form', elements);

        if (ID) {
            elements = { ...elements };
            // console.log('if form submit', elements);

            SharePointService.getListByTitle("ResignationList").items.getById(ID).update(elements).then(response => {
                setState(stateSchema);
                setOpen(true);
                setTimeout(() => { setOpen(false); }, 3000);
            });
        } else {
            showLoader(true);
            elements = { ...elements, 'Status': 'In Progress' };
            // console.log('else elements====', elements);

            SharePointService.getListByTitle("ResignationList").items.add(elements).then((response: ItemAddResult): void => {
                let item = response.data;
                if (item) {
                    SharePointService.getListByTitle("ItClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((itResponse: ItemAddResult) => {
                    });
                    SharePointService.getListByTitle("ManagersClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started", ManagerEmail: elements.ManagerEmail }).then((mngResponse: ItemAddResult) => {
                    });
                    SharePointService.getListByTitle("OperationsClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((OpsResponse: ItemAddResult) => {

                    });
                    SharePointService.getListByTitle("Finance%20Clearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((finResponse: ItemAddResult) => {

                    });
                    SharePointService.getListByTitle("SalesForceClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((sfResponse: ItemAddResult) => {
                    });
                    SharePointService.getListByTitle("HrClearance").items.add({ EmployeeNameId: item.ID, Status: "Not Started" }).then((hrResponse: ItemAddResult) => {
                    });
                    SharePointService.getListByTitle("Employee%20Details").items.add({ EmployeeNameId: item.ID, EmployeeCode: elements.EmployeeCode, FirstName: elements.FirstName, LastName: elements.LastName, LastWorkingDate: elements.LastWorkingDate, WorkEmail: elements.WorkEmail, Status: "Not Started" }).then((emplResponse: ItemAddResult) => {
                    });
                    showLoader(false);
                    setState(stateSchema);
                    setOpen(true);
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        }
    };

    function onSubmitForm(value) {
        console.log(value);
        for (const key in value) {
            value[key] = value[key].value;
        }
        addListItem(value);
    }
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
    const classes = useStyles(0);
    return (
        <Container component="main" className="marginBottom16 root removeBoxShadow">
            <Backdrop className={classes.backdrop} open={loader} onClick={handleBackdropClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Form Submitted Successfully!
                </Alert>
            </Snackbar>
            <div>
                <Typography variant="h5" component="h3">
                    Clearance Form
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                        <HomeIcon className={classes.icon} /> {strings.Home}
                    </Link>
                    <Typography color="textPrimary">Clearance Form</Typography>
                </Breadcrumbs>
                <form onSubmit={handleOnSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} className='employeeCode'>
                            <TextField variant="outlined" placeholder="Type a number" type="text" margin="normal" required fullWidth disabled={isdisable} label="Employee Code" value={state.EmployeeCode.value} name="EmployeeCode" autoComplete="off" onChange={handleEmployeeCode} onBlur={handleEmployeeCode} helperText="Please write code as written on pay slip" autoFocus />
                            {state.EmployeeCode.error && <p style={errorStyle}>{state.EmployeeCode.error}</p>}

                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <PeoplePicker context={props.context} defaultSelectedUsers={[state.WorkEmail.value]} ensureUser={true} titleText="Employee Name" isRequired={true} errorMessage="This field is required." personSelectionLimit={1} showtooltip={true} selectedItems={_getPeoplePickerItems} showHiddenInUI={false} principalTypes={[PrincipalType.User]} resolveDelay={100} />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={3} sm={3}>
                            <FormControl variant="outlined" className="fluid MuiFormControl-marginNormal" required>
                                <InputLabel htmlFor="salutation">Salutation</InputLabel>
                                <Select defaultValue={salutation[selectedOption]} value={state.salutation.value} required id="salutation" onChange={handleOnChange} onBlur={handleOnChange} disabled={isdisable} name="salutation"  >
                                    {salutation.map((list, index) => <MenuItem key={index} value={list}>{list}</MenuItem>)}
                                </Select>
                            </FormControl>
                            {state.salutation.error && <p style={errorStyle}>{state.salutation.error}</p>}
                        </Grid>
                        <Grid item xs={5} sm={5}>
                            <TextField variant="outlined" margin="normal" required fullWidth disabled={isdisable}
                                label="First Name" value={state.FirstName.value} name="FirstName" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.FirstName.error && <p style={errorStyle}>{state.FirstName.error}</p>}
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            <TextField variant="outlined" disabled={isdisable} margin="normal" required fullWidth label="Last Name" value={state.LastName.value} name="LastName" autoComplete="off" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.LastName.error && <p style={errorStyle}>{state.LastName.error}</p>}
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
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField disabled={isdisable} variant="outlined" margin="normal" required fullWidth label="Manager Email" value={state.ManagerEmail.value} onChange={handleOnChange} onBlur={handleOnBlur} name="ManagerEmail" />
                            {state.ManagerEmail.error && <p style={errorStyle}>{state.ManagerEmail.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField variant="outlined" margin="normal" required fullWidth label="Work Email" disabled={isdisable}
                                value={state.WorkEmail.value} name="WorkEmail" autoComplete="WorkEmail" onChange={handleOnChange} onBlur={handleOnBlur} />
                            {state.WorkEmail.error && <p style={errorStyle}>{state.WorkEmail.error}</p>}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" className="fluid MuiFormControl-marginNormal" required>
                                <InputLabel htmlFor="reason">Reason for Separation</InputLabel>
                                <Select defaultValue={resignationReasonList[selectedOption]} value={state.ResignationReason.value} required id="reason" onChange={handleOnChange} onBlur={handleOnChange} disabled={isdisable} name="ResignationReason"  >
                                    {resignationReasonList.map((list, index) => <MenuItem key={index} value={list}>{list}</MenuItem>)}
                                </Select>
                            </FormControl>
                            {state.ResignationReason.error && <p style={errorStyle}>{state.ResignationReason.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl variant="outlined" className="fluid MuiFormControl-marginNormal" required>
                                <InputLabel htmlFor="noticePeriod">Notice Period</InputLabel>
                                <Select defaultValue={noticePeriodList[selectedOption]} value={state.noticePeriod.value} required id="noticePeriod" onChange={handleOnChange} onBlur={handleOnChange} disabled={isdisable} name="noticePeriod"  >
                                    {noticePeriodList.map((list, index) => <MenuItem key={index} value={list}>{list}</MenuItem>)}
                                </Select>
                            </FormControl>
                            {state.noticePeriod.error && <p style={errorStyle}>{state.noticePeriod.error}</p>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                <KeyboardDatePicker label="Resignation Date" className="fullWidth" format="MM/dd/yyyy"
                                    value={state.ResignationDate.value} name="ResignationDate" onChange={handleResignationDateChange} />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                <KeyboardDatePicker label="Last Working Date" className="fullWidth" format="MM/dd/yyyy"
                                    value={state.LastWorkingDate.value} name="LastWorkingDate" onChange={handleDateChange} />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.AccountDeactivated.value}
                                        onChange={handleCheckbox}
                                        name="AccountDeactivated"
                                        color="primary"
                                    />
                                }
                                label="Account Deactivated?"
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" className="marginTop16" variant="contained" disabled={disable} color="primary">Submit</Button>
                </form>
            </div>

        </Container>
    );
};
export default ResignationForm;