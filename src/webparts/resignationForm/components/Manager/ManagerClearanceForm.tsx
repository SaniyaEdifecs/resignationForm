import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, Select, FormControlLabel, RadioGroup, Radio, makeStyles } from '@material-ui/core';
import { sp } from '@pnp/sp';
import useForm from '../UseForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';
import * as strings from 'ResignationFormWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

const ManagerClearance = (props) => {
    let ID = props.Id;
    let detail: any;
    let currentUser: any = [];
    let list = sp.web.lists.getByTitle("ManagersClearance");
    const [showButton, setButtonVisibility] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "AccessRemoval", "AccessRemovalComments", "DataBackup", "DataBackupComments", "EmailBackup", "EmailBackupComments", "EmailRe_x002d_routing", "EmailRe_x002d_routingComments", "HandoverComplete", "HandoverCompleteComments", "NoticeWaiver", "NoticeWaiverComments", "OtherComments", "Others_x0028_specify_x0029_", "MessageToAssociate", "AdditionalInformation", "DuesPending",
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
    const getEmployeeClearanceDetails = (employeeID) => {
        list.items.getById(employeeID).get().then((response: any) => {
            detail = response;
            getStatusDetails(detail.Status);
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

        payload = { ...payload, 'Status': status };
        list.items.getById(ID).update(payload).then(items => {
            showLoader(false);
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
                break;
            default:
                setButtonVisibility(true);
                break;
        }
    };


    const setEditAccessPermissions = () => {
        sp.web.currentUser.get().then((response) => {
            currentUser = response;
            if (currentUser) {
                const url = "https://aristocraticlemmings.sharepoint.com/sites/Resignation/_api/web/lists/getbytitle('ManagersClearance')/items(" + ID + ")/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
                props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
                    .then((response: SPHttpClientResponse): Promise<any> => {
                        return response.json();
                    }).then(permissionResponse => {
                        console.log("permissions reponse", permissionResponse);
                        let permissionLevel = permissionResponse;
                        if (permissionLevel.High == 2147483647 && permissionLevel.Low == 4294705151 ) {
                            setReadOnly(false);
                        } else if (permissionLevel.High == 48 && permissionLevel.Low == 134287360) {
                            setReadOnly(true);
                        } else if (permissionResponse.error || (permissionLevel.High == 176 && permissionLevel.Low == 138612833)) {
                            console.log(permissionResponse.error);
                            setReadOnly(true);
                        }
                    });

            }
        });
    }
    useEffect(() => {
        if (ID) {
            getEmployeeClearanceDetails(ID);
        }
        setEditAccessPermissions();
    }, []);


    useEffect(() => {
        validationStateSchema['MessageToAssociate'].required = state.DuesPending.value === 'NotifyAssociate';
        validationStateSchema['AdditionalInformation'].required = false;

        // if (state.DuesPending.value === 'NotifyAssociate') {
        //     setDisable(true);
        // }
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
    }));
    const classes = useStyles(0);
    const redirectHome = (url, userId) => {
        event.preventDefault();
        if (userId) {
            window.location.href = "?component=" + url + "&userId=" + userId;
        } else {
            window.location.href = strings.RootUrl + url;
        }
    };
    const handleClick = (url, userId) => {
        event.preventDefault();
        if (userId) {
            window.location.href = "?component=" + url + "&userId=" + userId;
        } else {
            window.location.href = url;
        }
    };
    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };

    return (
        <div>
            {loader ? <div className="loaderWrapper"><CircularProgress /></div> : null}
            <Typography variant="h5" component="h5">
                {strings.ManagerClearance}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => redirectHome("/", "")} className={classes.link}>
                    <HomeIcon className={classes.icon} /> {strings.Home}
                </Link>
                <Link color="inherit" onClick={() => handleClick(strings.ManagerDashboard, "")}>
                    Manager {strings.Dashboard}
                </Link>
                <Typography color="textPrimary">{strings.ClearanceForm}</Typography>
            </Breadcrumbs>
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
                            <td>Handover Complete</td>
                            <td>
                                <FormControl>
                                    <Select value={state.HandoverComplete.value} disabled={readOnly} id="HandoverComplete" onBlur={handleOnBlur} onChange={handleOnChange} name="HandoverComplete" autoFocus>
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
                            <td>Data Backup</td>
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
                            <td>Email Backup</td>
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
                            <td>Notice Waiver(No. of days)</td>
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
                            <td>Access Removal(All Applications)</td>
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
                            <td>Email Re-routing</td>
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
                            <td>Others (specify)</td>
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
                </div>
                {showButton ? <div>
                    {disable ? <div className="inlineBlock">
                        <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm} disabled={readOnly}>Save as draft</Button>
                        <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable || readOnly}>Submit</Button>
                    </div> :
                        <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={readOnly}>Submit</Button>}

                </div> : null}
            </form>
        </div>
    );
};

export default ManagerClearance;