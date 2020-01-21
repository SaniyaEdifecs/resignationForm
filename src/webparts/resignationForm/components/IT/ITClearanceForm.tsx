import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, InputLabel, MenuItem, FormControl, Select, FormControlLabel, Checkbox } from '@material-ui/core';
import { sp, ItemAddResult } from '@pnp/sp';
import useForm from '../UseForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

const ItClearance = ({props}) => {
    let ID = props;
    let detail: any;
    let list = sp.web.lists.getByTitle("ItClearance");
    const [isUserExist, setUserExistence] = useState(false);
    const [showButton, setButtonVisibility] = useState(true);
    const [duesPendingBoolean, setDuesPendingBoolean] = useState(false);
    const [disableDuesPending, setDisableDuesPending] = useState(false);
    const [isdisable, setDisable] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "DataBackup", "AccessRemoval", "DataCard", "Laptop_x002f_Desktop", "AccessCard", "IDCard", "PeripheralDevices", "PeripheralDevicesComments0", "AccessCardComments", "AccessRemovalComments", "DataBackupComments", "DataCardComments", "DesktopComments", "IDCardComments"
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
    stateSchema['selectFields'] = ["DataBackup", "AccessRemoval", "DataCard", "Laptop_x002f_Desktop", "AccessCard", "IDCard", "PeripheralDevices"];
    const onSubmitForm = (value) => {
        showLoader(true);
        let payload = {};
        for (const key in value) {
            payload[key] = value[key].value;
        }
        
        payload = { ...payload, 'Status': status, 'DuesPending': duesPendingBoolean };
        // if (isUserExist) {
        list.items.getById(ID).update(payload).then(items => {
            // console.log()
            showLoader(false);
            getEmployeeClearanceDetails(ID);
            
                  // window.location.href = "?component=itClearanceDashboard";

        }, (error: any): void => {
            // console.log('Error while creating the item: ' + error);
        });
        // }
        //  else {
        //     payload = { ...payload, ID };
        //     list.items.add(payload).then((response: ItemAddResult): void => {
        //         const item = response.data as string;
        //         if (item) {
        //             showLoader(false);
        //             // window.location.href = "?component=itClearanceDashboard";
        //         }
        //     }, (error: any): void => {
        //         // console.log('Error while creating the item: ' + error);
        //     });
        // }
    };
    const duesPendingChanged = (event) => {
        setDuesPendingBoolean(event.target.checked)
    }
    const { state, setState, disable, status, saveForm, handleOnChange, handleOnBlur, handleOnSubmit } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );

    useEffect(() => {
        if (ID) {
            getEmployeeClearanceDetails(ID);
        }
    }, []);



    const getStatusDetails = (status) => {
        switch (status) {
            case "null" || "Not Started" || "Pending":
                setButtonVisibility(true);
                // setStatus("Pending");
                break;
            // case "Pending":
            //     setButtonVisibility(true);
            //     break;
            case "Approved":
                setDisable(true);
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
            setUserExistence(true);
            formFields.forEach(formField => {
                if (detail[formField] == null) {
                    stateSchema[formField].value = "";
                    stateSchema[formField].error = "";
                } else {
                    stateSchema[formField].value = detail[formField];
                    stateSchema[formField].error = "";
                }
            });
            // // console.log("getdetail", stateSchema);
            setState(prevState => ({ ...prevState, stateSchema }));
        }, (error: any): void => {
            setButtonVisibility(true);
            // console.log('Error while creating the item: ' + error);
        });
    };



    useEffect(() => {
        setDuesPendingBoolean(false)
        setDisableDuesPending(false);
        let allYes = true;

        state.selectFields.forEach((field, key) => {

            if (state[field].value === 'No') {
                // console.log("found ")
                setDuesPendingBoolean(true)
                setDisableDuesPending(false);
                allYes = false;
            }
            if (state.selectFields.length - 1 === key && allYes === true) {
                // console.log("no no found ")
                setDisableDuesPending(true);
            }


        });

    }, [state]);
    useEffect(() => {

        // console.log("called")
        // action on update of movies
        // setDuesPendingBoolean(duesPendingBoolean)
        // console.log("duesPendingBoolean = ", duesPendingBoolean)
        // console.log("disableDuesPending = ", disableDuesPending)
    }, [duesPendingBoolean, disableDuesPending]);

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
            window.location.href = "?component=" + url;
        }
    }
    return (
        <div>
            {loader ? <div className="loaderWrapper"><CircularProgress /></div> : null}
            <Typography variant="h5" component="h5">
                IT Clearance
             </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => handleClick('itClearanceDashboard', "")}>
                    Dashboard
                    </Link>
                <Typography color="textPrimary">Clearance Form</Typography>
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
                                    <Select value={state.DataBackup.value} disabled={isdisable} id="DataBackup" onBlur={handleOnBlur} onChange={handleOnChange} name="DataBackup"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.DataBackup.error && <p style={errorStyle}>{state.DataBackup.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DataBackupComments" disabled={isdisable} required value={state.DataBackupComments.value} onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.DataBackupComments.error && <p style={errorStyle}>{state.DataBackupComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Access Removal (Email, User Account, All applications)</td>
                            <td>
                                <FormControl>
                                    <Select value={state.AccessRemoval.value} id="DataBackup" disabled={isdisable} onBlur={handleOnBlur} onChange={handleOnChange} name="AccessRemoval"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.AccessRemoval.error && <p style={errorStyle}>{state.AccessRemoval.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="AccessRemovalComments" disabled={isdisable} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.AccessRemovalComments.value} />
                                {state.AccessRemovalComments.error && <p style={errorStyle}>{state.AccessRemovalComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Phone & SIM/Data card</td>
                            <td>
                                <FormControl>
                                    <Select value={state.DataCard.value} id="DataCard" disabled={isdisable} onBlur={handleOnBlur} onChange={handleOnChange} name="DataCard"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.DataCard.error && <p style={errorStyle}>{state.DataCard.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DataCardComments" disabled={isdisable} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataCardComments.value} />
                                {state.DataCardComments.error && <p style={errorStyle}>{state.DataCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Laptop/Desktop/Dock Station</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Laptop_x002f_Desktop.value} disabled={isdisable} id="Laptop_x002f_Desktop" onBlur={handleOnBlur} onChange={handleOnChange} name="Laptop_x002f_Desktop"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Laptop_x002f_Desktop.error && <p style={errorStyle}>{state.Laptop_x002f_Desktop.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DesktopComments" disabled={isdisable} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DesktopComments.value} />
                                {state.DesktopComments.error && <p style={errorStyle}>{state.DesktopComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Access Card</td>
                            <td>
                                <FormControl>
                                    <Select value={state.AccessCard.value} disabled={isdisable} id="AccessCard" onBlur={handleOnBlur} onChange={handleOnChange} name="AccessCard"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.AccessCard.error && <p style={errorStyle}>{state.AccessCard.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} required onBlur={handleOnBlur} onChange={handleOnChange} name="AccessCardComments" value={state.AccessCardComments.value} />
                                {state.AccessCardComments.error && <p style={errorStyle}>{state.AccessCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>ID Card</td>
                            <td>
                                <FormControl>
                                    <Select value={state.IDCard.value} disabled={isdisable} id="IDCard" onBlur={handleOnBlur} onChange={handleOnChange} name="IDCard"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.IDCard.error && <p style={errorStyle}>{state.IDCard.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" required disabled={isdisable} onBlur={handleOnBlur} onChange={handleOnChange} name="IDCardComments" value={state.IDCardComments.value} />
                                {state.IDCardComments.error && <p style={errorStyle}>{state.IDCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Others- Chargers, mouse, headphones etc</td>
                            <td>
                                <FormControl>
                                    <Select value={state.PeripheralDevices.value} disabled={isdisable} required id="PeripheralDevices" onBlur={handleOnBlur} onChange={handleOnChange} name="PeripheralDevices"  >
                                        {options.map((option, index) => <MenuItem key={index} value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.PeripheralDevices.error && <p style={errorStyle}>{state.PeripheralDevices.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" required disabled={isdisable} onBlur={handleOnBlur} onChange={handleOnChange} name="PeripheralDevicesComments0" value={state.PeripheralDevicesComments0.value} />
                                {state.PeripheralDevicesComments0.error && <p style={errorStyle}>{state.PeripheralDevicesComments0.error}</p>}
                            </td>
                        </tr>
                        {showButton ? <tr>
                            <td colSpan={3} className="noBoxShadow">
                                <FormControlLabel control={<Checkbox name="DuesPending" value={duesPendingBoolean} checked={duesPendingBoolean} onChange={duesPendingChanged} disabled={disableDuesPending} />} label="Associate Notification " />
                            </td>
                        </tr> : null}
                        <tr>
                            <td>
                            <FormControlLabel control={<Checkbox name="GrantClearance" value={duesPendingBoolean} checked={duesPendingBoolean} onChange={duesPendingChanged} disabled={disableDuesPending} />} label="Grant Clearance " />
                            </td>
                            <td colSpan={2}>
                             <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Additional Information" name="AdditinalText" required placeholder="Any additional information" multiline margin="normal" variant="outlined" onChange={handleOnChange} onBlur={handleOnBlur} />
                    
                            </td>
                        </tr>
                        {showButton ? <tr>
                            <td colSpan={3} >
                                {/* <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button> */}
                                {disable == true || disableDuesPending == false ? <div className="inlineBlock">
                                    <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save as draft</Button>
                                    <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable || disableDuesPending == false}>Submit</Button>
                                </div> :
                                    <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Submit</Button>}
                            </td>
                        </tr> : null}

                    </tbody>
                </table>
            </form>
        </div >
    );
};

export default ItClearance;