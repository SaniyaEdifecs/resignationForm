import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, Select, makeStyles, FormControlLabel, RadioGroup, Radio, Snackbar  } from '@material-ui/core';
import useForm from '../UseForm';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import * as strings from 'ResignationFormWebPartStrings';
import HomeIcon from '@material-ui/icons/Home';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Alert } from '@material-ui/lab';
import SharePointService from '../SharePointServices';
import Moment from 'react-moment';

const OperationsAdminClearance = (props) => {
    let ID = props.Id;
    let currentUser: any = [];
    let detail: any;
    const [buttonVisibility, setButtonVisibility] = useState(true);
    const [confirmMsg, setConfirmMsg] = useState('Form Saved Successfully!');
    const [resignationDetails, setResignationDetails] = useState([])
    const [showMsg, setShowMsg] = useState(false);
    const [open, setOpen] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const options1 = ['Received', 'Not Received','NA'];
    const options2 = ['Activated', 'Deactivated'];
    const formFields = [
        "BiometricAccess", "BiometricAccessComments", "KuoniConcurAccess", "KuoniConcurAccessComments", "Others", "OthersComments", "PedestalKeys", "PedestalKeysComments", "SimCard", "SimCardComments", "StickerComments", "Stickers", "MessageToAssociate", "AdditionalInformation", "DuesPending","StationaryClearanceComments","StationaryClearance"
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
    const onSubmitForm = (value) => {
        showLoader(true);
        let payload = {};
        for (const key in value) {
            payload[key] = value[key].value;
        }
        if(payload['DuesPending'] == 'NotifyAssociate'){
            setConfirmMsg('Message Sent to Employee');
            
        }else if(payload['DuesPending'] == 'GrantClearance'){
            setConfirmMsg('Form Submitted Successfully')
        }else{
            setConfirmMsg('Form Saved Successfully!')
        }
        payload = { ...payload, 'Status': status };
        SharePointService.getListByTitle("OperationsClearance").items.getById(ID).update(payload).then(items => {
            showLoader(false);
            setOpen(true);
            getEmployeeClearanceDetails(ID);
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


    const getEmployeeClearanceDetails = (clearanceId) => {
        SharePointService.getListByTitle("OperationsClearance").items.getById(clearanceId).get().then((response: any) => {
            detail = response;
            getStatusDetails(detail.Status);
            setEditAccessPermissions(detail.Status);
            SharePointService.getListByTitle("ResignationList").items.getById(detail.EmployeeNameId).get().then((resignDetails: any) => {
                setResignationDetails(resignDetails);
            });
            formFields.forEach(formField => {
                if (detail[formField] == null) {
                    stateSchema[formField].value = "";
                    stateSchema[formField].error = "";
                } else {
                    stateSchema[formField].value = detail[formField];
                    stateSchema[formField].error = "";
                }
            });
            setState(prevState => ({ ...prevState, stateSchema }));
        }, (error: any): void => {
            setButtonVisibility(true);
        });
    };

    const setEditAccessPermissions = (statusValue) => {
        SharePointService.getCurrentUser().then((response) => {
            currentUser = response;
            if (currentUser) {
                const url = props.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('OperationsClearance')/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
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
                {strings.OpsClearance}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                    <HomeIcon className={classes.icon} /> {strings.Home}
                </Link>
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.OpsDashboard, "")}>
                  Operations  {strings.Dashboard}
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
                            <td><span>Employee Code: </span><span>{resignationDetails['EmployeeCode']}</span></td>
                        </tr>
                        <tr>
                            <td><span>Resignation Date: </span><span> <Moment format="DD/MM/YYYY">{resignationDetails['ResignationDate']}</Moment></span></td>
                            <td><span>Last working Date: </span><span><Moment format="DD/MM/YYYY">{resignationDetails['LastWorkingDate']}</Moment></span></td>
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
                            <td>Pedestal Keys<span>*</span></td>
                            <td>
                                <FormControl required>
                                    <Select value={state.PedestalKeys.value} disabled={readOnly} id="PedestalKeys" onBlur={handleOnBlur} onChange={handleOnChange} name="PedestalKeys" autoFocus>
                                        {options1.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.PedestalKeys.error && <p style={errorStyle}>{state.PedestalKeys.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} required onBlur={handleOnBlur} name="PedestalKeysComments" value={state.PedestalKeysComments.value} />
                                {state.PedestalKeysComments.error && <p style={errorStyle}>{state.PedestalKeysComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Car/Bikes Stickers<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.Stickers.value} disabled={readOnly} id="Stickers" onBlur={handleOnBlur} onChange={handleOnChange} name="Stickers"  >
                                        {options1.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Stickers.error && <p style={errorStyle}>{state.Stickers.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} required onBlur={handleOnBlur} name="StickerComments" value={state.StickerComments.value} />
                                {state.StickerComments.error && <p style={errorStyle}>{state.StickerComments.error}</p>}
                            </td>
                        </tr>
                        {/* <tr>
                            <td>Library Books<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.LibraryBooks.value} disabled={readOnly} id="LibraryBooks" onBlur={handleOnBlur} onChange={handleOnChange} name="LibraryBooks"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.LibraryBooks.error && <p style={errorStyle}>{state.LibraryBooks.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} onBlur={handleOnBlur} required name="LibraryBooksComments" value={state.LibraryBooksComments.value} />
                                {state.LibraryBooksComments.error && <p style={errorStyle}>{state.LibraryBooksComments.error}</p>}
                            </td>
                        </tr> */}
                         <tr>
                            <td>Stationary Clearance<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.StationaryClearance.value} disabled={readOnly} id="StationaryClearance" onBlur={handleOnBlur} onChange={handleOnChange} name="StationaryClearance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.StationaryClearance.error && <p style={errorStyle}>{state.StationaryClearance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} onBlur={handleOnBlur} required name="StationaryClearanceComments" value={state.StationaryClearanceComments.value} />
                                {state.StationaryClearanceComments.error && <p style={errorStyle}>{state.StationaryClearanceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>SIM Card/ Dongle/Mobile<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.SimCard.value} disabled={readOnly} id="SimCard" onBlur={handleOnBlur} onChange={handleOnChange} name="SimCard"  >
                                        {options1.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.SimCard.error && <p style={errorStyle}>{state.SimCard.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} onBlur={handleOnBlur} required name="SimCardComments" value={state.SimCardComments.value} />
                                {state.SimCardComments.error && <p style={errorStyle}>{state.SimCardComments.error}</p>}
                            </td>
                        </tr>
                        {/* <tr>
                            <td>Visiting Cards<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.VisitingCards.value} disabled={readOnly} id="VisitingCards" onBlur={handleOnBlur} onChange={handleOnChange} name="VisitingCards"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.VisitingCards.error && <p style={errorStyle}>{state.VisitingCards.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} onBlur={handleOnBlur} required name="VisitingCardsComments" value={state.VisitingCardsComments.value} />
                                {state.VisitingCardsComments.error && <p style={errorStyle}>{state.VisitingCardsComments.error}</p>}
                            </td>
                        </tr> */}
                        <tr>
                            <td>Travel Portal Access<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.KuoniConcurAccess.value} disabled={readOnly} id="KuoniConcurAccess" onBlur={handleOnBlur} onChange={handleOnChange} name="KuoniConcurAccess"  >
                                        {options2.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.KuoniConcurAccess.error && <p style={errorStyle}>{state.KuoniConcurAccess.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} onBlur={handleOnBlur} required name="KuoniConcurAccessComments" value={state.KuoniConcurAccessComments.value} />
                                {state.KuoniConcurAccessComments.error && <p style={errorStyle}>{state.KuoniConcurAccessComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Biometric Access<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.BiometricAccess.value} disabled={readOnly} id="BiometricAccess" onBlur={handleOnBlur} onChange={handleOnChange} name="BiometricAccess"  >
                                        {options2.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.BiometricAccess.error && <p style={errorStyle}>{state.BiometricAccess.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} onBlur={handleOnBlur} required name="BiometricAccessComments" value={state.BiometricAccessComments.value} />
                                {state.BiometricAccessComments.error && <p style={errorStyle}>{state.BiometricAccessComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Others(specify)<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.Others.value} disabled={readOnly} id="Others" onBlur={handleOnBlur} onChange={handleOnChange} name="Others"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Others.error && <p style={errorStyle}>{state.Others.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} onBlur={handleOnBlur} required name="OthersComments" value={state.OthersComments.value} />
                                {state.OthersComments.error && <p style={errorStyle}>{state.OthersComments.error}</p>}
                            </td>
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

export default OperationsAdminClearance;