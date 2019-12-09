import * as React from 'react';
import { Typography, TextField, Button, InputLabel, MenuItem, FormControl, Select, FormControlLabel, Checkbox } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
import useForm from '../UseForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';

const ManagerClearance = (props) => {
    let ID = props.props;
    let detail: any;
    let list = sp.web.lists.getByTitle("ManagersClearance");
    const [isUserExist, setUserExistence] = useState(false);
    const [showButton, setButtonVisibility] = useState(true);
    const [duesPending, setDuesPending] = useState();
    const [isdisable, setDisable] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "AccessRemoval", "AccessRemovalComments", "DataBackup", "DataBackupComments", "EmailBackup", "EmailBackupComments", "EmailRe_x002d_routing", "EmailRe_x002d_routingComments", "HandoverComplete", "HandoverCompleteComments", "NoticeWaiver", "NoticeWaiverComments", "OtherComments", "Others_x0028_specify_x0029_",
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

    const handleChange = (event) => {
        setDuesPending({ ...state, ['duesPending']: event.target.checked });
    };
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
            console.log(detail)
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
        if (isUserExist) {
            list.items.getById(ID).update(value).then(i => {
                showLoader(false);
                window.location.href = "?component=managerClearanceDashboard";
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        } else {
            value = { ...value, ID };
            list.items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    showLoader(false);
                    window.location.href = "?component=managerClearanceDashboard";
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        }
    };
    const { state, setState, disable, status, setStatus, saveForm, handleOnChange, handleOnBlur, handleOnSubmit } = useForm(
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
            {/* <p><Link to="/itManagerDashboard:/">Dashboard</Link>  </p> */}
            <Typography variant="h5" component="h5">
                Manager Clearance
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
                            <td>Handover Complete</td>
                            <td>
                                <FormControl>
                                    <Select value={state.HandoverComplete.value} disabled={isdisable} id="HandoverComplete" onBlur={handleOnBlur} onChange={handleOnChange} name="HandoverComplete"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.HandoverComplete.error && <p style={errorStyle}>{state.HandoverComplete.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="HandoverCompleteComments" disabled={isdisable} required value={state.HandoverCompleteComments.value} onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.HandoverCompleteComments.error && <p style={errorStyle}>{state.HandoverCompleteComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Data Backup</td>
                            <td>
                                <FormControl>
                                    <Select value={state.DataBackup.value} id="DataBackup" disabled={isdisable} onBlur={handleOnBlur} onChange={handleOnChange} name="DataBackup"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.DataBackup.error && <p style={errorStyle}>{state.DataBackup.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DataBackupComments" disabled={isdisable} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataBackupComments.value} />
                                {state.DataBackupComments.error && <p style={errorStyle}>{state.DataBackupComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Email Backup</td>
                            <td>
                                <FormControl>
                                    <Select value={state.EmailBackup.value} id="EmailBackup" disabled={isdisable} onBlur={handleOnBlur} onChange={handleOnChange} name="EmailBackup"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.EmailBackup.error && <p style={errorStyle}>{state.EmailBackup.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="EmailBackupComments" disabled={isdisable} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.EmailBackupComments.value} />
                                {state.EmailBackupComments.error && <p style={errorStyle}>{state.EmailBackupComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Notice Waiver(No. of days)</td>
                            <td>
                                <FormControl>
                                    <Select value={state.NoticeWaiver.value} id="NoticeWaiver" disabled={isdisable} onBlur={handleOnBlur} onChange={handleOnChange} name="NoticeWaiver"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.NoticeWaiver.error && <p style={errorStyle}>{state.NoticeWaiver.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="NoticeWaiverComments" disabled={isdisable} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.NoticeWaiverComments.value} />
                                {state.NoticeWaiverComments.error && <p style={errorStyle}>{state.NoticeWaiverComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Access Removal(All Applications)</td>
                            <td>
                                <FormControl>
                                    <Select value={state.AccessRemoval.value} disabled={isdisable} id="AccessRemoval" onBlur={handleOnBlur} onChange={handleOnChange} name="AccessRemoval"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.AccessRemoval.error && <p style={errorStyle}>{state.AccessRemoval.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} required onBlur={handleOnBlur} onChange={handleOnChange} name="AccessRemovalComments" value={state.AccessRemovalComments.value} />
                                {state.AccessRemovalComments.error && <p style={errorStyle}>{state.AccessRemovalComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Email Re-routing</td>
                            <td>
                                <FormControl>
                                    <Select value={state.EmailRe_x002d_routing.value} disabled={isdisable} id="EmailRe_x002d_routing" onBlur={handleOnBlur} onChange={handleOnChange} name="EmailRe_x002d_routing"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.EmailRe_x002d_routing.error && <p style={errorStyle}>{state.EmailRe_x002d_routing.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" required disabled={isdisable} onBlur={handleOnBlur} onChange={handleOnChange} name="EmailRe_x002d_routingComments" value={state.EmailRe_x002d_routingComments.value} />
                                {state.EmailRe_x002d_routingComments.error && <p style={errorStyle}>{state.EmailRe_x002d_routingComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Others (specify)</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Others_x0028_specify_x0029_.value} disabled={isdisable} id="Others_x0028_specify_x0029_" onBlur={handleOnBlur} onChange={handleOnChange} name="Others_x0028_specify_x0029_"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Others_x0028_specify_x0029_.error && <p style={errorStyle}>{state.Others_x0028_specify_x0029_.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="OtherComments" disabled={isdisable} required onBlur={handleOnBlur} onChange={handleOnChange} value={state.OtherComments.value} />
                                {state.OtherComments.error && <p style={errorStyle}>{state.OtherComments.error}</p>}
                            </td>
                        </tr>
                        {showButton ? <tr>
                            <td colSpan={3} >
                                <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button>
                                {disable == true ? <div className="inlineBlock">
                                    <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save as draft</Button>
                                    <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>
                                </div> : <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>}
                            </td>
                        </tr> : null}
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default ManagerClearance;