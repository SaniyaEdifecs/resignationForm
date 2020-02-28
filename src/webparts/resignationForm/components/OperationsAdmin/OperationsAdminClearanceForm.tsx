import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, Select, makeStyles, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { sp } from '@pnp/sp';
import useForm from '../UseForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import * as strings from 'ResignationFormWebPartStrings';
import HomeIcon from '@material-ui/icons/Home';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

const OperationsAdminClearance = (props) => {
    let ID = props.Id;
    let currentUser: any = [];
    let detail: any;
    let list = sp.web.lists.getByTitle("OperationsClearance");
    const [showButton, setButtonVisibility] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "BiometricAccess", "BiometricAccessComments", "KuoniConcurAccess", "KuoniConcurAccessComments", "LibraryBooks", "LibraryBooksComments", "Others", "OthersComments", "PedestalKeys", "PedestalKeysComments", "SimCard", "SimCardComments", "StickerComments", "Stickers", "VisitingCards", "VisitingCardsComments", "MessageToAssociate", "AdditionalInformation", "DuesPending"
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
                const url = "https://aristocraticlemmings.sharepoint.com/sites/Resignation/_api/web/lists/getbytitle('OperationsClearance')/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
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
            // window.location.href = window.location.pathname + url;
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
                {strings.OpsClearance}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => redirectHome("/", "")} className={classes.link}>
                    <HomeIcon className={classes.icon} /> {strings.Home}
                </Link>
                <Link color="inherit" onClick={() => handleClick(strings.OpsDashboard, "")}>
                  Operations  {strings.Dashboard}
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
                            <td>Pedestal Keys</td>
                            <td>
                                <FormControl>
                                    <Select value={state.PedestalKeys.value} disabled={readOnly} id="PedestalKeys" onBlur={handleOnBlur} onChange={handleOnChange} name="PedestalKeys" autoFocus>
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
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
                            <td>Car/Bikes Stickers</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Stickers.value} disabled={readOnly} id="Stickers" onBlur={handleOnBlur} onChange={handleOnChange} name="Stickers"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Stickers.error && <p style={errorStyle}>{state.Stickers.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} required onBlur={handleOnBlur} name="StickerComments" value={state.StickerComments.value} />
                                {state.StickerComments.error && <p style={errorStyle}>{state.StickerComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Library Books</td>
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
                        </tr>
                        <tr>
                            <td>Sim Card</td>
                            <td>
                                <FormControl>
                                    <Select value={state.SimCard.value} disabled={readOnly} id="SimCard" onBlur={handleOnBlur} onChange={handleOnChange} name="SimCard"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.SimCard.error && <p style={errorStyle}>{state.SimCard.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" disabled={readOnly} onChange={handleOnChange} onBlur={handleOnBlur} required name="SimCardComments" value={state.SimCardComments.value} />
                                {state.SimCardComments.error && <p style={errorStyle}>{state.SimCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Visiting Cards</td>
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
                        </tr>
                        <tr>
                            <td>Kuoni & Concur Access</td>
                            <td>
                                <FormControl>
                                    <Select value={state.KuoniConcurAccess.value} disabled={readOnly} id="KuoniConcurAccess" onBlur={handleOnBlur} onChange={handleOnChange} name="KuoniConcurAccess"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
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
                            <td>Biometric Access</td>
                            <td>
                                <FormControl>
                                    <Select value={state.BiometricAccess.value} disabled={readOnly} id="BiometricAccess" onBlur={handleOnBlur} onChange={handleOnChange} name="BiometricAccess"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
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
                            <td>Others(specify)</td>
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

export default OperationsAdminClearance;