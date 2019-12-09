import * as React from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, Select, FormControlLabel, Checkbox } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
import useForm from '../UseForm';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';

const OperationsAdminClearance = (props) => {
    let ID = props.props;
    let detail: any;
    let list = sp.web.lists.getByTitle("OperationsClearance");
    const [isUserExist, setUserExistence] = useState(false);
    const [hideButton, setButtonVisibility] = useState();
    const [isdisable, setDisable] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "BiometricAccess", "BiometricAccessComments", "KuoniConcurAccess", "KuoniConcurAccessComments", "LibraryBooks", "LibraryBooksComments", "Others", "OthersComments", "PedestalKeys", "PedestalKeysComments", "SimCard", "SimCardComments", "StickerComments", "Stickers", "VisitingCards", "VisitingCardsComments",
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
        if (isUserExist) {
            list.items.getById(ID).update(value).then(i => {
                showLoader(false);
                // getEmployeeClearanceDetails(ID);
                window.location.href = "?component=operationsAdminDashboard";

            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        } else {
            value = { ...value, ID };
            list.items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    showLoader(false);
                    window.location.href = "?component=operationsAdminDashboard";
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        }
    };

    const { state, disable, status, setState, saveForm, handleOnChange, handleOnBlur, handleOnSubmit, } = useForm(
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
            {/* <p><Link to="/operationsAdminDashboard">Dashboards</Link></p> */}
            <Typography variant="h5" component="h5">
                Operations Clearance
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
                            <td>Pedestal Keys</td>
                            <td>
                                <FormControl>
                                    <Select value={state.PedestalKeys.value} disabled={isdisable} id="PedestalKeys" onBlur={handleOnBlur} onChange={handleOnChange} name="PedestalKeys"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.PedestalKeys.error && <p style={errorStyle}>{state.PedestalKeys.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} onChange={handleOnChange} required onBlur={handleOnBlur} name="PedestalKeysComments" value={state.PedestalKeysComments.value} />
                                {state.PedestalKeysComments.error && <p style={errorStyle}>{state.PedestalKeysComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Car/Bikes Stickers</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Stickers.value} disabled={isdisable} id="Stickers" onBlur={handleOnBlur} onChange={handleOnChange} name="Stickers"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Stickers.error && <p style={errorStyle}>{state.Stickers.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} onChange={handleOnChange} required onBlur={handleOnBlur} name="StickerComments" value={state.StickerComments.value} />
                                {state.StickerComments.error && <p style={errorStyle}>{state.StickerComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Library Books</td>
                            <td>
                                <FormControl>
                                    <Select value={state.LibraryBooks.value} disabled={isdisable} id="LibraryBooks" onBlur={handleOnBlur} onChange={handleOnChange} name="LibraryBooks"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.LibraryBooks.error && <p style={errorStyle}>{state.LibraryBooks.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} onChange={handleOnChange} onBlur={handleOnBlur} required name="LibraryBooksComments" value={state.LibraryBooksComments.value} />
                                {state.LibraryBooksComments.error && <p style={errorStyle}>{state.LibraryBooksComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Sim Card</td>
                            <td>
                                <FormControl>
                                    <Select value={state.SimCard.value} disabled={isdisable} id="SimCard" onBlur={handleOnBlur} onChange={handleOnChange} name="SimCard"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.SimCard.error && <p style={errorStyle}>{state.SimCard.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} onChange={handleOnChange} onBlur={handleOnBlur} required name="SimCardComments" value={state.SimCardComments.value} />
                                {state.SimCardComments.error && <p style={errorStyle}>{state.SimCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Visiting Cards</td>
                            <td>
                                <FormControl>
                                    <Select value={state.VisitingCards.value} disabled={isdisable} id="VisitingCards" onBlur={handleOnBlur} onChange={handleOnChange} name="VisitingCards"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.VisitingCards.error && <p style={errorStyle}>{state.VisitingCards.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} onChange={handleOnChange} onBlur={handleOnBlur} required name="VisitingCardsComments" value={state.VisitingCardsComments.value} />
                                {state.VisitingCardsComments.error && <p style={errorStyle}>{state.VisitingCardsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Kuoni & Concur Access</td>
                            <td>
                                <FormControl>
                                    <Select value={state.KuoniConcurAccess.value} disabled={isdisable} id="KuoniConcurAccess" onBlur={handleOnBlur} onChange={handleOnChange} name="KuoniConcurAccess"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.KuoniConcurAccess.error && <p style={errorStyle}>{state.KuoniConcurAccess.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} onChange={handleOnChange} onBlur={handleOnBlur} required name="KuoniConcurAccessComments" value={state.KuoniConcurAccessComments.value} />
                                {state.KuoniConcurAccessComments.error && <p style={errorStyle}>{state.KuoniConcurAccessComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Biometric Access</td>
                            <td>
                                <FormControl>
                                    <Select value={state.BiometricAccess.value} disabled={isdisable} id="BiometricAccess" onBlur={handleOnBlur} onChange={handleOnChange} name="BiometricAccess"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.BiometricAccess.error && <p style={errorStyle}>{state.BiometricAccess.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} onChange={handleOnChange} onBlur={handleOnBlur} required name="BiometricAccessComments" value={state.BiometricAccessComments.value} />
                                {state.BiometricAccessComments.error && <p style={errorStyle}>{state.BiometricAccessComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Others(specify)</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Others.value} disabled={isdisable} id="Others" onBlur={handleOnBlur} onChange={handleOnChange} name="Others"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Others.error && <p style={errorStyle}>{state.Others.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={isdisable} onChange={handleOnChange} onBlur={handleOnBlur} required name="OthersComments" value={state.OthersComments.value} />
                                {state.OthersComments.error && <p style={errorStyle}>{state.OthersComments.error}</p>}
                            </td>
                        </tr>
                        {hideButton ? <tr>
                            <td colSpan={3} >
                                <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button>
                                {disable == true ? <div className="inlineBlock">
                                    <Button type="button" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save as draft</Button>
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

export default OperationsAdminClearance;