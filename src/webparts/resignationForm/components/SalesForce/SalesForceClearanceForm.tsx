import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, Select, FormControlLabel, RadioGroup, Radio, makeStyles, Snackbar } from '@material-ui/core';
import useForm from '../UseForm';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';
import * as strings from 'ResignationFormWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Alert } from '@material-ui/lab';
import SharePointService from '../SharePointServices';

const SalesForceClearance = (props) => {
    let ID = props.Id;
    let detail: any;
    let currentUser: any = [];
    const [buttonVisibility, setButtonVisibility] = useState(true);
    const [open, setOpen] = useState(false);
    const [showMsg, setShowMsg] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = ["LicenseTermination", "LicenseTerminationComment", "MessageToAssociate", "AdditionalInformation", "DuesPending"];
    var stateSchema = {};
    var validationStateSchema = {};
    formFields.forEach(formField => {
        stateSchema[formField] = {};
        stateSchema[formField].value = "";
        stateSchema[formField].error = "";
        validationStateSchema[formField] = {};
        if (formField === 'AdditionalInformation' || formField === 'MessageToAssociate') {
            validationStateSchema[formField].required = false;
        } else {
            validationStateSchema[formField].required = true;
        }
        validationStateSchema[formField].validator = {
            regex: '',
            error: ''
        };
    });

    const onSubmitForm = (value) => {
        showLoader(true);
        let payload = {};
        for (const key in value) {
            payload[key] = value[key].value;
        }

        payload = { ...payload, 'Status': status };
        SharePointService.getListByTitle("SalesForceClearance").items.getById(ID).update(payload).then(items => {
            showLoader(false);
            setOpen(true);
            getEmployeeClearanceDetails(ID);
        }, (error: any): void => {
            // console.log('Error while creating the item: ' + error);
        });
    }
    const { state, setState, disable, status, saveForm, handleOnChange, handleOnBlur, handleOnSubmit } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );

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

    const getEmployeeClearanceDetails = (clearanceId) => {
        SharePointService.getListByTitle("SalesForceClearance").items.getById(clearanceId).get().then((response: any) => {
            detail = response;
            getStatusDetails(detail.Status);
            setEditAccessPermissions(detail.Status);
            formFields.forEach(formField => {
                stateSchema[formField].value = detail[formField] ? detail[formField] : "";
                stateSchema[formField].error = "";
            });
            // console.log("getdetail", stateSchema);
            setState(prevState => ({ ...prevState, stateSchema }));
        }, (error: any): void => {
            setButtonVisibility(true);
            // console.log('Error while creating the item: ' + error);
        });
    };
    useEffect(() => {
        validationStateSchema['MessageToAssociate'].required = state.DuesPending.value === 'NotifyAssociate';
        validationStateSchema['AdditionalInformation'].required = false;

        if (validationStateSchema['MessageToAssociate'].required && !state.MessageToAssociate.value) {
            if (state.MessageToAssociate.error === '') {
                setState(prevState => ({
                    ...prevState,
                    ['MessageToAssociate']: { value: '', error: 'This field is required' }
                }));
            }
        } else {
            if (state.MessageToAssociate.error !== '') {
                setState(prevState => ({
                    ...prevState,
                    ['MessageToAssociate']: { value: '', error: '' }
                }));

            }
        }
    }, [state]);

    const setEditAccessPermissions = (statusValue) => {
        SharePointService.getCurrentUser().then((response) => {
            currentUser = response;
            if (currentUser) {
                const url = props.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('SalesForceClearance')/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
                props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
                    .then((response: SPHttpClientResponse): Promise<any> => {
                        return response.json();
                    }).then(permissionResponse => {
                        console.log("permissionResponse:", permissionResponse);
                        let permissionLevel = permissionResponse;
                        if (statusValue == 'Approved' || statusValue == 'Canceled') {
                            SharePointService.getCurrentUserGroups().then((groups: any) => {
                                let isGroupOwner = groups.filter(group => group.Title === "Resignation Group - Owners").length;
                                if (statusValue == 'Approved') {
                                    setReadOnly(isGroupOwner ? false : true);
                                } else {
                                    setReadOnly(isGroupOwner ? true : false);
                                }
                                setButtonVisibility(isGroupOwner ? true : false);
                            });
                        } else {
                            if (permissionLevel.High == 2147483647 && permissionLevel.Low == 4294705151) {
                                setReadOnly(false);
                            } else if (permissionResponse.error ||
                                (permissionLevel.High == 176 && permissionLevel.Low == 138612833) ||
                                (permissionLevel.High == 48 && permissionLevel.Low == 134287360)) {
                                console.log("permissionResponse.error:", permissionResponse.error);
                                setReadOnly(true);
                            }
                        }
                    });

            }
        });
    }
    useEffect(() => {
        if (ID) {
            getEmployeeClearanceDetails(ID);
        }
    }, []);


    const useStyles = makeStyles(theme => ({
        link: {
            display: 'flex',
        },
        icon: {
            marginRight: theme.spacing(0.5),
            width: 20,
            height: 20,
        },
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }));
    const classes = useStyles(0);
    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };

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
            <Typography variant="h5" component="h5">
                {strings.SalesForceClearance}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                    <HomeIcon className={classes.icon} /> {strings.Home}
                </Link>
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.SalesForceDashboard, "")}>
                    SalesForce {strings.Dashboard}
                </Link>
                <Typography color="textPrimary">{strings.ClearanceForm}</Typography>
            </Breadcrumbs>
            {showMsg && <div className={classes.root}>
                <Alert severity="warning" className="marginTop16">This resignation is withdrawn - No Action Required!</Alert>
            </div>}
            <form onSubmit={handleOnSubmit} className="clearanceForm">
                <table cellSpacing="0" cellPadding="0">
                    <thead>
                        <tr>
                            <th></th>
                            <th>YES/NO/NA</th>
                            <th>COMMENTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>SFDC License Termination: Kiranpreet Kaur<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.LicenseTermination.value} disabled={readOnly} id="LicenseTermination" onBlur={handleOnBlur} onChange={handleOnChange} name="LicenseTermination" autoFocus>
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.LicenseTermination.error && <p style={errorStyle}>{state.LicenseTermination.error}</p>}
                                </FormControl>
                            </td>
                            <td><TextField margin="normal" disabled={readOnly} name="LicenseTerminationComment" required onChange={handleOnChange} onBlur={handleOnBlur} value={state.LicenseTerminationComment.value} />
                                {state.LicenseTerminationComment.error && <p style={errorStyle}>{state.LicenseTerminationComment.error}</p>}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="noBoxShadow ">
                    <RadioGroup aria-label="DuesPending" name="DuesPending" value={state.DuesPending.value} onChange={handleOnChange} onBlur={handleOnChange}>
                        <FormControlLabel value="NotifyAssociate" control={<Radio disabled={readOnly} />} label="Message to Associate" />
                        {state.DuesPending.value === 'NotifyAssociate' ?
                            <div>
                                <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Message To Associate" name="MessageToAssociate" disabled={readOnly} placeholder="Enter message here..." multiline margin="normal" variant="outlined" onChange={handleOnChange} onBlur={handleOnChange} value={state.MessageToAssociate.value} />
                                {state.MessageToAssociate.error && <p style={errorStyle}>{state.MessageToAssociate.error}</p>}
                            </div>
                            : ''}
                        <FormControlLabel value="GrantClearance" control={<Radio disabled={readOnly} />} label="Grant Clearance" />
                        {state.DuesPending.value === 'GrantClearance' ?
                            <div>
                                <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Additional Information" name="AdditionalInformation" disabled={readOnly} placeholder="Any additional information" multiline margin="normal" variant="outlined" value={state.AdditionalInformation.value} onChange={handleOnChange} onBlur={handleOnChange}
                                />

                            </div>
                            : ''}
                    </RadioGroup>
                    {state.DuesPending.error ? <p style={errorStyle}>{state.DuesPending.error}</p> : ''}
                </div>
                {buttonVisibility ? <div>
                    {!disable || state.DuesPending.value === 'NotifyAssociate' ?
                        (
                            state.DuesPending.value === 'NotifyAssociate' ?
                                <Button type="submit" className="marginTop16" variant="contained" color="primary" onClick={saveForm} disabled={readOnly}>Submit</Button> :
                                <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={readOnly}>Submit</Button>
                        )
                        :
                        <div className="inlineBlock">
                            <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm} disabled={readOnly}>Save</Button>
                        </div>}
                </div> : null}

            </form>
        </div>
    );
};

export default SalesForceClearance;