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
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Alert } from '@material-ui/lab';
import SharePointService from '../SharePointServices';
import Moment from 'react-moment';
import { sp } from '@pnp/sp';
import { PermissionKind } from "@pnp/sp";


const FinanceClearance = (props) => {
    let ID = props.Id;
    let detail: any;
    let currentUser: any = [];
    const [open, setOpen] = useState(false);
    const [buttonVisibility, setButtonVisibility] = useState(true);
    const [confirmMsg, setConfirmMsg] = useState('Form Saved Successfully!');
    const [resignationDetails, setResignationDetails] = useState([]);
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
        if(payload['DuesPending'] == 'NotifyAssociate'){
            setConfirmMsg('Message Sent to Employee');
            
        }else if(payload['DuesPending'] == 'GrantClearance'){
            setConfirmMsg('Form Submitted Successfully');
        }else{
            setConfirmMsg('Form Saved Successfully!');
        }
        payload = { ...payload, 'Status': status };
        SharePointService.getListByTitle("Finance%20Clearance").items.getById(ID).update(payload).then(items => {
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

    const setEditAccessPermissions = (statusValue) => {
        SharePointService.getCurrentUser().then(async (response) => {
            currentUser = response;

            if (currentUser) {
                let currentUserPermission = await sp.web.lists.getByTitle('ItClearance').userHasPermissions(currentUser.LoginName, PermissionKind.EditListItems);
                const url = props.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('Finance%20Clearance')/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
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
                            if ((permissionLevel.High == 2147483647 && permissionLevel.Low == 4294705151) || currentUserPermission) {
                                setReadOnly(false);
                            } else if (permissionResponse.error){                               
                                console.log("permissionResponse.error: currentUserPermission",currentUserPermission, permissionResponse.error);
                                setReadOnly(true);
                            }
                        }
                    });

            }
        });
    };

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
        SharePointService.getListByTitle("Finance%20Clearance").items.getById(clearanceId).get().then((response: any) => {
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
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }));
    const classes = useStyles(0);
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
                {strings.FinanceClearance}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                    <HomeIcon className={classes.icon} /> {strings.Home}
                </Link>
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.FinanceDashboard, "")}>
                    Finance {strings.Dashboard}
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
                            <td>Loan/Imprest Balance<span>*</span></td>
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
                            <td>Travel Advance/Expenses<span>*</span></td>
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
                            <td>Telephone Reimbursement<span>*</span></td>
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
                            <td>Revoke all confedential Information(credit cards, debit card, bank account login credentials etc)<span>*</span></td>
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
                            <td>Talentoz Access<span>*</span></td>
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
                            <td>Investement Proofs as required for income tax<span>*</span></td>
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
                            <td>1. House Rent Receipts<span>*</span></td>
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
                            <td>2. Investement u/s 80C<span>*</span></td>
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
                            <td>3. Housing Loan<span>*</span></td>
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

export default FinanceClearance;