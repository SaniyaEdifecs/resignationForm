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
import { Alert } from '@material-ui/lab';
import SharePointService from '../SharePointServices';

const FinanceClearance = (props) => {
    console.log(props);
    let ID = props.Id;
    let detail: any;
    let currentUser: any = [];
    let list = sp.web.lists.getByTitle("Finance%20Clearance");
    const [buttonVisibility, setButtonVisibility] = useState(true);
    const [showMsg, setShowMsg] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "ConfidentialInfoComments", "ConfidentialInformation", "HouseRentReceipts", "HouseRentReceiptsComments", "HousingLoan", "HousingLoanComments", "Investment80C", "Investment80cComments", "InvestmentProofs", "InvestmentProofsComments", "Loan_x002f_ImprestBalance", "Loan_x002f_ImprestBalanceComment", "TalentozAccess", "TalentozAccessComments", "TelephoneReimbursement", "TelephoneReimbursementComments", "TravelAdvance_x002f_Expenses", "TravelAdvance_x002f_ExpensesComm", "DuesPending", "MessageToAssociate", "AdditionalInformation"
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

    const setEditAccessPermissions = (statusValue) => {
        sp.web.currentUser.get().then((response) => {
            currentUser = response;
            if (currentUser) {
                const url = props.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Finance%20Clearance')/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
                props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
                    .then((response: SPHttpClientResponse): Promise<any> => {
                        return response.json();
                    }).then(permissionResponse => {
                        console.log("permissions reponse", permissionResponse);
                        let permissionLevel = permissionResponse;
                        if (statusValue != 'Approved' && statusValue != 'Canceled') {
                            if ((permissionLevel.High == 2147483647 && permissionLevel.Low == 4294705151)) {
                                setReadOnly(false);
                            } else if (permissionLevel.High == 48 && permissionLevel.Low == 134287360) {
                                setReadOnly(true);
                            } else if (permissionResponse.error || (permissionLevel.High == 176 && permissionLevel.Low == 138612833)) {
                                console.log(permissionResponse.error);
                                setReadOnly(true);
                            }
                        } else if (statusValue == 'Approved') {
                            SharePointService.checkResignationOwner().then((groups: any) => {
                                setReadOnly(groups.filter(groupName => groupName.Title === "Resignation Group - Owners").length ? false : true);
                                setButtonVisibility(groups.filter(groupName => groupName.Title === "Resignation Group - Owners").length ? true : false);
                            });
                        }
                        else if (statusValue == 'Canceled') {
                            SharePointService.checkResignationOwner().then((groups: any) => {
                                setReadOnly(groups.filter(groupName => groupName.Title === "Resignation Group - Owners").length ? true : false);
                                setButtonVisibility(groups.filter(groupName => groupName.Title === "Resignation Group - Owners").length ? true : false);
                            });
                        }
                    });

            }
        });
    }
 

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
        list.items.getById(clearanceId).get().then((response: any) => {
            detail = response;
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
            setState(prevState => ({ ...prevState, stateSchema }));
        }, (error: any): void => {
            setButtonVisibility(true);
            // console.log('Error while creating the item: ' + error);
        });
    };

    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
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
    }));
    const classes = useStyles(0);
    const redirectHome = (url, resignationId) => {
        event.preventDefault();
        if (resignationId) {
            window.location.href = "?component=" + url + "&resignationId=" + resignationId;
        } else {
            window.location.href = url;
        }
    };

    const handleClick = (url, resignationId) => {
        event.preventDefault();
        if (resignationId) {
            window.location.href = "?component=" + url + "&resignationId=" + resignationId;
        } else {
            window.location.href = url;
            // window.location.href = window.location.pathname + url;
        }
    };
    return (
        <div>
            {loader ? <div className="loaderWrapper"><CircularProgress /></div> : null}
            <Typography variant="h5" component="h5">
                {strings.FinanceClearance}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => redirectHome(strings.HomeUrl, "")} className={classes.link}>
                    <HomeIcon className={classes.icon} /> {strings.Home}
                </Link>
                <Link color="inherit" onClick={() => handleClick(strings.FinanceDashboard, "")}>
                 Finance {strings.Dashboard}
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
                            <td>Loan/Imprest Balance</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Loan_x002f_ImprestBalance.value} disabled={readOnly} id="Loan_x002f_ImprestBalance" onBlur={handleOnBlur} onChange={handleOnChange} name="Loan_x002f_ImprestBalance" autoFocus >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Loan_x002f_ImprestBalance.error && <p style={errorStyle}>{state.Loan_x002f_ImprestBalance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} disabled={readOnly} onBlur={handleOnBlur} required name="Loan_x002f_ImprestBalanceComment" value={state.Loan_x002f_ImprestBalanceComment.value} />
                                {state.Loan_x002f_ImprestBalanceComment.error && <p style={errorStyle}>{state.Loan_x002f_ImprestBalanceComment.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Travel Advance/Expenses</td>
                            <td>
                                <FormControl>
                                    <Select value={state.TravelAdvance_x002f_Expenses.value} disabled={readOnly} id="TravelAdvance_x002f_Expenses" onBlur={handleOnBlur} onChange={handleOnChange} name="TravelAdvance_x002f_Expenses"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TravelAdvance_x002f_Expenses.error && <p style={errorStyle}>{state.TravelAdvance_x002f_Expenses.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TravelAdvance_x002f_ExpensesComm" disabled={readOnly} value={state.TravelAdvance_x002f_ExpensesComm.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TravelAdvance_x002f_ExpensesComm.error && <p style={errorStyle}>{state.TravelAdvance_x002f_ExpensesComm.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Telephone Reimbursement</td>
                            <td>
                                <FormControl>
                                    <Select value={state.TelephoneReimbursement.value} disabled={readOnly} id="TelephoneReimbursement" onBlur={handleOnBlur} onChange={handleOnChange} name="TelephoneReimbursement"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TelephoneReimbursement.error && <p style={errorStyle}>{state.TelephoneReimbursement.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TelephoneReimbursementComments" disabled={readOnly} value={state.TelephoneReimbursementComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TelephoneReimbursementComments.error && <p style={errorStyle}>{state.TelephoneReimbursementComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Revoke all confedential Information(credit cards, debit card, bank account login credentials etc)</td>
                            <td>
                                <FormControl>
                                    <Select value={state.ConfidentialInformation.value} disabled={readOnly} id="ConfidentialInformation" onBlur={handleOnBlur} onChange={handleOnChange} name="ConfidentialInformation"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ConfidentialInformation.error && <p style={errorStyle}>{state.ConfidentialInformation.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ConfidentialInfoComments" disabled={readOnly} value={state.ConfidentialInfoComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.ConfidentialInfoComments.error && <p style={errorStyle}>{state.ConfidentialInfoComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Talentoz Access</td>
                            <td>
                                <FormControl>
                                    <Select value={state.TalentozAccess.value} id="TalentozAccess" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="TalentozAccess"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TalentozAccess.error && <p style={errorStyle}>{state.TalentozAccess.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TalentozAccessComments" disabled={readOnly} value={state.TalentozAccessComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TalentozAccessComments.error && <p style={errorStyle}>{state.TalentozAccessComments.error}</p>}
                            </td>
                        </tr>

                        <tr>
                            <td>Investement Proofs as required for income tax</td>
                            <td>
                                <FormControl>
                                    <Select value={state.InvestmentProofs.value} disabled={readOnly} id="InvestmentProofs" onBlur={handleOnBlur} onChange={handleOnChange} name="InvestmentProofs"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.InvestmentProofs.error && <p style={errorStyle}>{state.InvestmentProofs.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="InvestmentProofsComments" disabled={readOnly} value={state.InvestmentProofsComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.InvestmentProofsComments.error && <p style={errorStyle}>{state.InvestmentProofsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>1. House Rent Receipts</td>
                            <td>
                                <FormControl>
                                    <Select value={state.HouseRentReceipts.value} disabled={readOnly} id="HouseRentReceipts" onBlur={handleOnBlur} onChange={handleOnChange} name="HouseRentReceipts"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.HouseRentReceipts.error && <p style={errorStyle}>{state.HouseRentReceipts.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="HouseRentReceiptsComments" disabled={readOnly} value={state.HouseRentReceiptsComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.HouseRentReceiptsComments.error && <p style={errorStyle}>{state.HouseRentReceiptsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>2. Investement u/s 80C</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Investment80C.value} id="Investment80C" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="Investment80C"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Investment80C.error && <p style={errorStyle}>{state.Investment80C.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="Investment80cComments" disabled={readOnly} value={state.Investment80cComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.Investment80cComments.error && <p style={errorStyle}>{state.Investment80cComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>3. Housing Loan</td>
                            <td>
                                <FormControl>
                                    <Select value={state.HousingLoan.value} disabled={readOnly} id="HousingLoan" onBlur={handleOnBlur} onChange={handleOnChange} name="HousingLoan"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.HousingLoan.error && <p style={errorStyle}>{state.HousingLoan.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="HousingLoanComments" disabled={readOnly} value={state.HousingLoanComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.HousingLoanComments.error && <p style={errorStyle}>{state.HousingLoanComments.error}</p>}
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

export default FinanceClearance;