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
import Moment from 'react-moment';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Alert } from '@material-ui/lab';
import SharePointService from '../SharePointServices';

const ManagerClearance = (props) => {
    let ID = props.Id;
    let detail: any;
    let currentUser: any = [];
    const [confirmMsg, setConfirmMsg] = useState('Form Saved Successfully!');
    const [buttonVisibility, setButtonVisibility] = useState(true);
    const [resignationDetails, setResignationDetails] = useState([]);
    const [showMsg, setShowMsg] = useState(false);
    const [open, setOpen] = useState(false);
    const [loader, showLoader] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "AccessRemoval", "AccessRemovalComments", "DataBackup", "DataBackupComments", "EmailBackup", "EmailBackupComments", "EmailRe_x002d_routing", "EmailRe_x002d_routingComments", "HandoverComplete", "HandoverCompleteComments", "NoticeWaiver", "NoticeWaiverComments", "OtherComments", "Others_x0028_specify_x0029_", "MessageToAssociate", "AdditionalInformation", "DuesPending",
        "RecoveryAmountComments", "RecoveryAmount"
    ];

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
    const getEmployeeClearanceDetails = (clearanceId) => {
        SharePointService.getListByTitle("ManagersClearance").items.getById(clearanceId).get().then((response: any) => {
            detail = response;
            // console.log(detail);
            SharePointService.getListByTitle("ResignationList").items.getById(detail.EmployeeNameId).get().then((resignDetails: any) => {
                // console.log('resig',resignDetails);
                setResignationDetails(resignDetails);
            });
            getStatusDetails(detail.Status);
            setEditAccessPermissions(detail.Status);
            formFields.forEach(formField => {
                if (detail[formField] == null) {
                    stateSchema[formField].value = "";
                    stateSchema[formField].error = "";
                } else {
                    stateSchema[formField].value = detail[formField];
                    stateSchema[formField].error = "";
                }
            });
            // console.log("getdetail", stateSchema);
            setState(prevState => ({ ...prevState, stateSchema }));
        }, (error: any): void => {
            setButtonVisibility(true);
            // console.log('Error while creating the item: ' + error);
        });
    };
    const onSubmitForm = (value) => {
        showLoader(true);
        let payload = {};
        for (const key in value) {
            payload[key] = value[key].value;
        }
        if(payload['DuesPending'] == 'NotifyAssociate'){
            setConfirmMsg('Message Sent to Employee.');
            
        }else if(payload['DuesPending'] == 'GrantClearance'){
            setConfirmMsg('Form Submitted Successfully!');
        }else{
            setConfirmMsg('Form Saved Successfully!');
        }
        payload = { ...payload, 'Status': status };
        SharePointService.getListByTitle("ManagersClearance").items.getById(ID).update(payload).then(items => {
            showLoader(false);
            setOpen(true);
            getEmployeeClearanceDetails(ID);
            // window.location.href = "?component=itClearanceDashboard";
        }, (error: any): void => {
            // console.log('Error while creating the item: ' + error);
        });
    };
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

    const setEditAccessPermissions = (statusValue) => {
        SharePointService.getCurrentUser().then((response) => {
            currentUser = response;
            if (currentUser) {
                const url = props.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('ManagersClearance')/items(" + ID + ")/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
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
                                setReadOnly(true);
                            }
                        }
                    });

            }
        });
    };
    useEffect(() => {
        if (ID) {
            getEmployeeClearanceDetails(ID);
        }
    }, []);


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

    const daysdifference = (date1, date2) => {
        // The number of milliseconds in one day
        var ONEDAY = 1000 * 60 * 60 * 24;
        // Convert both dates to milliseconds
        var date1_ms = new Date(date1);
        var date2_ms = new Date(date2);
        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms.getTime() - date2_ms.getTime());

        // Convert back to days and return
        return Math.round(difference_ms / ONEDAY) + 1;
    };
    return (
        <div>
            <Backdrop className={classes.backdrop} open={loader} onClick={handleBackdropClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    {confirmMsg}
                    </Alert>
            </Snackbar>
            <Typography variant="h5" component="h5">
                {strings.ManagerClearance}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                    <HomeIcon className={classes.icon} /> {strings.Home}
                </Link>
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.ManagerDashboard, "")}>
                    Manager {strings.Dashboard}
                </Link>
                <Typography color="textPrimary">{strings.ClearanceForm}</Typography>
            </Breadcrumbs>
            {showMsg && <div className={classes.root}>
                <Alert severity="warning" className="marginTop16">This resignation is withdrawn - No Action Required!</Alert>
            </div>}

            <form onSubmit={handleOnSubmit} className="clearanceForm">
                <table cellSpacing="0" cellPadding="0" className="employeeDetails">
                    <thead>
                        <tr>
                            <th colSpan={6} align="left"> Employee Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr >
                            <td><span>Employee Name: </span><span>{resignationDetails['EmployeeName']}</span></td>

                            <td><span>Resignation Date: </span><span> <Moment format="DD/MM/YYYY">{resignationDetails['ResignationDate']}</Moment></span></td>

                            <td><span>Last working Date: </span><span><Moment format="DD/MM/YYYY">{resignationDetails['LastWorkingDate']}</Moment></span></td>
                        </tr>
                        
                        <tr>
                            <td><span>Notice Period Served: </span><span>{daysdifference(resignationDetails['LastWorkingDate'], resignationDetails['ResignationDate'])} day(s)</span></td>
                            <td colSpan={2}><span>Shortfall Notice Period: </span><span>
                                {resignationDetails['noticePeriod'] ? 
                                resignationDetails['noticePeriod'] - daysdifference(resignationDetails['LastWorkingDate'], resignationDetails['ResignationDate']):45 - daysdifference(resignationDetails['LastWorkingDate'], resignationDetails['ResignationDate'])} day(s)</span></td>
                        </tr>

                    </tbody>
                </table>
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
                            <td>Do you approve early relieving (short of notice period)?<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.NoticeWaiver.value} id="NoticeWaiver" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="NoticeWaiver"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.NoticeWaiver.error && <p style={errorStyle}>{state.NoticeWaiver.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="NoticeWaiverComments" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.NoticeWaiverComments.value} />
                                {state.NoticeWaiverComments.error && <p style={errorStyle}>{state.NoticeWaiverComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Do you approve the recovery amount, if any (after adjustment of short fall of notice period with paid leaves)?<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.RecoveryAmount.value} id="RecoveryAmount" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="RecoveryAmount"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.RecoveryAmount.error && <p style={errorStyle}>{state.RecoveryAmount.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="RecoveryAmountComments" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.RecoveryAmountComments.value} />
                                {state.RecoveryAmountComments.error && <p style={errorStyle}>{state.RecoveryAmountComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td >Have you removed all access(Applications)?<span>*</span> </td>
                            <td>
                                <FormControl>
                                    <Select value={state.AccessRemoval.value} disabled={readOnly} id="AccessRemoval" onBlur={handleOnBlur} onChange={handleOnChange} name="AccessRemoval"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.AccessRemoval.error && <p style={errorStyle}>{state.AccessRemoval.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} name="AccessRemovalComments" value={state.AccessRemovalComments.value} />
                                {state.AccessRemovalComments.error && <p style={errorStyle}>{state.AccessRemovalComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Handover Complete<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.HandoverComplete.value} disabled={readOnly} id="HandoverComplete" onBlur={handleOnBlur} onChange={handleOnChange} name="HandoverComplete" >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.HandoverComplete.error && <p style={errorStyle}>{state.HandoverComplete.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="HandoverCompleteComments" disabled={readOnly} required value={state.HandoverCompleteComments.value} onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.HandoverCompleteComments.error && <p style={errorStyle}>{state.HandoverCompleteComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3}><p className="height44"><b>Instructions for IT</b></p></td>
                        </tr>
                        <tr>
                            <td>Data Backup<span>*</span>
                            </td>
                            <td>
                                <FormControl>
                                    <Select value={state.DataBackup.value} id="DataBackup" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="DataBackup"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.DataBackup.error && <p style={errorStyle}>{state.DataBackup.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DataBackupComments" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataBackupComments.value} />
                                {state.DataBackupComments.error && <p style={errorStyle}>{state.DataBackupComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Email Backup<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.EmailBackup.value} id="EmailBackup" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="EmailBackup"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.EmailBackup.error && <p style={errorStyle}>{state.EmailBackup.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="EmailBackupComments" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.EmailBackupComments.value} />
                                {state.EmailBackupComments.error && <p style={errorStyle}>{state.EmailBackupComments.error}</p>}
                            </td>
                        </tr>


                        <tr>
                            <td>Email Re-routing<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.EmailRe_x002d_routing.value} disabled={readOnly} id="EmailRe_x002d_routing" onBlur={handleOnBlur} onChange={handleOnChange} name="EmailRe_x002d_routing"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.EmailRe_x002d_routing.error && <p style={errorStyle}>{state.EmailRe_x002d_routing.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" required disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="EmailRe_x002d_routingComments" value={state.EmailRe_x002d_routingComments.value} />
                                {state.EmailRe_x002d_routingComments.error && <p style={errorStyle}>{state.EmailRe_x002d_routingComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Others (specify)<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.Others_x0028_specify_x0029_.value} disabled={readOnly} id="Others_x0028_specify_x0029_" onBlur={handleOnBlur} onChange={handleOnChange} name="Others_x0028_specify_x0029_"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Others_x0028_specify_x0029_.error && <p style={errorStyle}>{state.Others_x0028_specify_x0029_.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="OtherComments" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.OtherComments.value} />
                                {state.OtherComments.error && <p style={errorStyle}>{state.OtherComments.error}</p>}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="noBoxShadow ">
                    <RadioGroup aria-label="DuesPending" name="DuesPending" value={state.DuesPending.value} onChange={handleOnChange} onBlur={handleOnChange}>
                        <FormControlLabel value="NotifyAssociate" control={<Radio disabled={readOnly} />} label="Message to Associate" />


                        {state.DuesPending.value === 'NotifyAssociate' ?
                            <div>
                                <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Message To Associate*" name="MessageToAssociate" disabled={readOnly} placeholder="Enter message here..." multiline margin="normal" variant="outlined" onChange={handleOnChange} onBlur={handleOnChange} value={state.MessageToAssociate.value} />
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

export default ManagerClearance;