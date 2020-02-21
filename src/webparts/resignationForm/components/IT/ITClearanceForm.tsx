import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, Select, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { sp } from '@pnp/sp';
import useForm from '../UseForm';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import * as strings from 'ResignationFormWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

const ItClearance = (props) => {
    let ID = props.Id;
    let detail: any;
    let currentUser: any = [];
    let list = sp.web.lists.getByTitle("ItClearance");
    const [showButton, setButtonVisibility] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "DataBackup", "AccessRemoval", "DataCard", "Laptop_x002f_Desktop", "AccessCard", "IDCard", "PeripheralDevices", "PeripheralDevicesComments0", "AccessCardComments", "AccessRemovalComments", "DataBackupComments", "DataCardComments", "DesktopComments", "IDCardComments", "MessageToAssociate", "AdditionalInformation", 'DuesPending'
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
    // stateSchema['selectFields'] = ["DataBackup", "AccessRemoval", "DataCard", "Laptop_x002f_Desktop", "AccessCard", "IDCard", "PeripheralDevices"];

    const onSubmitForm = (value) => {
        showLoader(true);
        let payload = {};
        for (const key in value) {
            payload[key] = value[key].value;
        }

        payload = { ...payload, 'Status': status };
        // console.log("payload", payload);
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
    const setEditAccessPermissions = () => {
        sp.web.currentUser.get().then((response) => {
            currentUser = response;
            if (currentUser) {
                const url = "https://aristocraticlemmings.sharepoint.com/sites/Resignation/_api/web/lists/getbytitle('ItClearance')/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
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
                        }else if(permissionResponse.error){
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
        //     setStatus("Pending");
        // }
        // else {
        //     if (disable != true && state.DuesPending.value === 'GrantClearance') {
        //         setStatus("Approved");
        //     }
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

        // setDisableDuesPending(false);
        // let allYes = true;
        // state.selectFields.forEach((field, key) => {
        //     if (state[field].value === 'No') {
        //         // console.log("found ")
        //         setDuesPendingBoolean(true)
        //         setDisableDuesPending(false);
        //         allYes = false;
        //     }
        //     if (state.selectFields.length - 1 === key && allYes === true) {
        //         // console.log("no no found ")
        //         setDisableDuesPending(true);
        //     }
        // });

    }, [state]);


    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };
    const handleClick = (url, userId) => {
        event.preventDefault();
        if (userId) {
            window.location.href = "?component=" + url + "&userId=" + userId;
        } else {
            window.location.href = window.location.pathname + url;
        }
    };
    return (
        <div>
            {loader ? <div className="loaderWrapper"><CircularProgress /></div> : null}
            <Typography variant="h5" component="h5">
                {strings.ItClearance}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => handleClick('', "")}>
                    {strings.Dashboard}
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
                            <td>Mailbox and important data back-up</td>
                            <td>
                                <FormControl>
                                    <Select value={state.DataBackup.value} disabled={readOnly} id="DataBackup" onBlur={handleOnBlur} onChange={handleOnChange} name="DataBackup" autoFocus>
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.DataBackup.error && <p style={errorStyle}>{state.DataBackup.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DataBackupComments" disabled={readOnly} required value={state.DataBackupComments.value} onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.DataBackupComments.error && <p style={errorStyle}>{state.DataBackupComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Access Removal (Email, User Account, All applications)</td>
                            <td>
                                <FormControl>
                                    <Select value={state.AccessRemoval.value} id="DataBackup" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="AccessRemoval"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.AccessRemoval.error && <p style={errorStyle}>{state.AccessRemoval.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="AccessRemovalComments" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.AccessRemovalComments.value} />
                                {state.AccessRemovalComments.error && <p style={errorStyle}>{state.AccessRemovalComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Phone & SIM/Data card</td>
                            <td>
                                <FormControl>
                                    <Select value={state.DataCard.value} id="DataCard" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="DataCard"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.DataCard.error && <p style={errorStyle}>{state.DataCard.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DataCardComments" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataCardComments.value} />
                                {state.DataCardComments.error && <p style={errorStyle}>{state.DataCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Laptop/Desktop/Dock Station</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Laptop_x002f_Desktop.value} disabled={readOnly} id="Laptop_x002f_Desktop" onBlur={handleOnBlur} onChange={handleOnChange} name="Laptop_x002f_Desktop"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Laptop_x002f_Desktop.error && <p style={errorStyle}>{state.Laptop_x002f_Desktop.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DesktopComments" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DesktopComments.value} />
                                {state.DesktopComments.error && <p style={errorStyle}>{state.DesktopComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Access Card</td>
                            <td>
                                <FormControl>
                                    <Select value={state.AccessCard.value} disabled={readOnly} id="AccessCard" onBlur={handleOnBlur} onChange={handleOnChange} name="AccessCard"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.AccessCard.error && <p style={errorStyle}>{state.AccessCard.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} required onBlur={handleOnBlur} onChange={handleOnChange} name="AccessCardComments" value={state.AccessCardComments.value} />
                                {state.AccessCardComments.error && <p style={errorStyle}>{state.AccessCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>ID Card</td>
                            <td>
                                <FormControl>
                                    <Select value={state.IDCard.value} disabled={readOnly} id="IDCard" onBlur={handleOnBlur} onChange={handleOnChange} name="IDCard"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.IDCard.error && <p style={errorStyle}>{state.IDCard.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" required disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="IDCardComments" value={state.IDCardComments.value} />
                                {state.IDCardComments.error && <p style={errorStyle}>{state.IDCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Others- Chargers, mouse, headphones etc</td>
                            <td>
                                <FormControl>
                                    <Select value={state.PeripheralDevices.value} disabled={readOnly} required id="PeripheralDevices" onBlur={handleOnBlur} onChange={handleOnChange} name="PeripheralDevices"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.PeripheralDevices.error && <p style={errorStyle}>{state.PeripheralDevices.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" required disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="PeripheralDevicesComments0" value={state.PeripheralDevicesComments0.value} />
                                {state.PeripheralDevicesComments0.error && <p style={errorStyle}>{state.PeripheralDevicesComments0.error}</p>}
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
                    {/* {disable == true || disableDuesPending == false ? <div className="inlineBlock"> */}
                    {disable ? <div className="inlineBlock">
                        <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm} disabled={readOnly}>Save as draft</Button>
                        <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable || readOnly}>Submit</Button>
                        {/* <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable || disableDuesPending == false}>Submit</Button> */}
                    </div> :
                        <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={readOnly}>Submit</Button>}

                </div> : null}
            </form>
        </div >
    );
};

export default ItClearance;