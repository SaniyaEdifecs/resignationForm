import * as React from 'react';
import { Typography, TextField, Button, InputLabel, MenuItem, FormControl, Select, FormControlLabel, Checkbox } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
import useForm from '../UseForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';

const ItClearance = (props) => {
    let ID = props.props;
    let detail: any;
    let list = sp.web.lists.getByTitle("ItClearance");
    const [isUserExist, setUserExistence] = useState(false);
    const [showButton, setButtonVisibility] = useState(true);
    const [isdisable, setDisable] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "DataBackup", "AccessRemoval", "DataCard", "Laptop_x002f_Desktop", "AccessCard", "IDCard", "PeripheralDevices", "PeripheralDevicesComments0", "AccessCardComments", "AccessRemovalComments", "DataBackupComments", "DataCardComments", "DesktopComments", "IDCardComments","DuesPending"
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
    useEffect(() => {
        if (ID) {
            getEmployeeClearanceDetails(ID);
        }
    }, []);

    const getStatusdetails = (status) => {
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
            getStatusdetails(detail.Status);
            setUserExistence(true);
            formFields.forEach(formField => {
                if (detail[formField] == null) {
                    stateSchema[formField].value = "";
                    stateSchema[formField].error = "";
                } else {
                    stateSchema[formField].value = detail[formField] + "";
                    stateSchema[formField].error = "";
                }
            });
            console.log("getdetail", stateSchema);
            setState(prevState => ({ ...prevState, stateSchema }));
        }, (error: any): void => {
            setButtonVisibility(true);
            console.log('Error while creating the item: ' + error);
        });
    };

    const onSubmitForm = (value) => {
        showLoader(true);
        for (const key in value) {
            value[key] = value[key].value;
        }
        value = { ...value, 'Status': status };
        console.log("save==========dues", value)
        if (isUserExist) {
            list.items.getById(ID).update(value).then(i => {
                showLoader(false);
                // getEmployeeClearanceDetails(ID);
                // window.location.href = "?component=itClearanceDashboard";

            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        } else {
            value = { ...value, ID };
            list.items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    showLoader(false);
                    // window.location.href = "?component=itClearanceDashboard";
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        }
    };
    const { state, setState, disable, status, saveForm, handleOnChange, handleOnBlur, handleOnSubmit } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm,
    );
    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };
    return (
        <div>
            {loader ? <div className="loaderWrapper"><CircularProgress /></div> : null}
            {/* <p><Link to="/itClearanceDashboard">Dashboard</Link></p> */}
            <Typography variant="h5" component="h5">
                IT Clearance
             </Typography>
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
                                <FormControlLabel control={<Checkbox name="DuesPending" required={false} defaultChecked={state.DuesPending.value} onChange={handleOnChange} value={state.DuesPending.value}/>} label="Dues Pending" />
                            </td>
                        </tr> : null}
                        {showButton ? <tr>
                            <td colSpan={3} >
                                {/* <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button> */}
                                {disable == true ? <div className="inlineBlock">
                                    <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save as draft</Button>
                                    <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>
                                </div> : <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>}
                            </td>
                        </tr> : null}

                    </tbody>
                </table>
            </form>
        </div >
    );
};

export default ItClearance;