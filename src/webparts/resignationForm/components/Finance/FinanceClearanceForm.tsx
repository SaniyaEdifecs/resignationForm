import * as React from 'react';
import { Typography, TextField, Button, InputLabel, MenuItem, FormControl, Select, FormControlLabel, Checkbox } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
import useForm from '../UseForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';

const FinanceClearance = (props) => {
    let ID = props.props;
    let detail: any;
    let list = sp.web.lists.getByTitle("Finance%20Clearance");
    const [isUserExist, setUserExistence] = useState(false);
    const [showButton, setButtonVisibility] = useState(true);
    const [duesPending, setDuesPending] = useState();
    const [isdisable, setDisable] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "ConfidentialInfoComments", "ConfidentialInformation", "HouseRentReceipts", "HouseRentReceiptsComments", "HousingLoan", "HousingLoanComments", "Investment80C", "Investment80cComments", "InvestmentProofs", "InvestmentProofsComments", "Loan_x002f_ImprestBalance", "Loan_x002f_ImprestBalanceComment", "TalentozAccess", "TalentozAccessComments", "TelephoneReimbursement", "TelephoneReimbursementComments", "TravelAdvance_x002f_Expenses", "TravelAdvance_x002f_ExpensesComm"
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
                break;
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
                window.location.href = "?component=financeDashboard";

            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        } else {
            value = { ...value, ID };
            list.items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    showLoader(false);
                    window.location.href = "?component=financeDashboard";
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
            <Typography variant="h5" component="h5">
                Finance Clearance
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
                            <td>Loan/Imprest Balance</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Loan_x002f_ImprestBalance.value} disabled={isdisable}  id="Loan_x002f_ImprestBalance" onBlur={handleOnBlur} onChange={handleOnChange} name="Loan_x002f_ImprestBalance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Loan_x002f_ImprestBalance.error && <p style={errorStyle}>{state.Loan_x002f_ImprestBalance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} disabled={isdisable}  onBlur={handleOnBlur} required name="Loan_x002f_ImprestBalanceComment" value={state.Loan_x002f_ImprestBalanceComment.value} />
                                {state.Loan_x002f_ImprestBalanceComment.error && <p style={errorStyle}>{state.Loan_x002f_ImprestBalanceComment.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Travel Advance/Expenses</td>
                            <td>
                                <FormControl>
                                    <Select value={state.TravelAdvance_x002f_Expenses.value} disabled={isdisable}  id="TravelAdvance_x002f_Expenses" onBlur={handleOnBlur} onChange={handleOnChange} name="TravelAdvance_x002f_Expenses"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TravelAdvance_x002f_Expenses.error && <p style={errorStyle}>{state.TravelAdvance_x002f_Expenses.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TravelAdvance_x002f_ExpensesComm" disabled={isdisable}  value={state.TravelAdvance_x002f_ExpensesComm.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TravelAdvance_x002f_ExpensesComm.error && <p style={errorStyle}>{state.TravelAdvance_x002f_ExpensesComm.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Telephone Reimbursement</td>
                            <td>
                                <FormControl>
                                    <Select value={state.TelephoneReimbursement.value} disabled={isdisable}  id="TelephoneReimbursement" onBlur={handleOnBlur} onChange={handleOnChange} name="TelephoneReimbursement"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TelephoneReimbursement.error && <p style={errorStyle}>{state.TelephoneReimbursement.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TelephoneReimbursementComments" disabled={isdisable}  value={state.TelephoneReimbursementComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TelephoneReimbursementComments.error && <p style={errorStyle}>{state.TelephoneReimbursementComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Revoke all confedential Information(credit cards, debit card, bank account login credentials etc)</td>
                            <td>
                                <FormControl>
                                    <Select value={state.ConfidentialInformation.value} disabled={isdisable}  id="ConfidentialInformation" onBlur={handleOnBlur} onChange={handleOnChange} name="ConfidentialInformation"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ConfidentialInformation.error && <p style={errorStyle}>{state.ConfidentialInformation.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ConfidentialInfoComments" disabled={isdisable}  value={state.ConfidentialInfoComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.ConfidentialInfoComments.error && <p style={errorStyle}>{state.ConfidentialInfoComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Talentoz Access</td>
                            <td>
                                <FormControl>
                                    <Select value={state.TalentozAccess.value} id="TalentozAccess" disabled={isdisable} onBlur={handleOnBlur} onChange={handleOnChange} name="TalentozAccess"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TalentozAccess.error && <p style={errorStyle}>{state.TalentozAccess.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TalentozAccessComments" disabled={isdisable}  value={state.TalentozAccessComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TalentozAccessComments.error && <p style={errorStyle}>{state.TalentozAccessComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Investement Proofs as required for income tax</td>
                            <td>
                                <FormControl>
                                    <Select value={state.InvestmentProofs.value} disabled={isdisable}  id="InvestmentProofs" onBlur={handleOnBlur} onChange={handleOnChange} name="InvestmentProofs"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.InvestmentProofs.error && <p style={errorStyle}>{state.InvestmentProofs.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="InvestmentProofsComments" disabled={isdisable}  value={state.InvestmentProofsComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.InvestmentProofsComments.error && <p style={errorStyle}>{state.InvestmentProofsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>1. House Rent Receipts</td>
                            <td>
                                <FormControl>
                                    <Select value={state.HouseRentReceipts.value} disabled={isdisable}  id="HouseRentReceipts" onBlur={handleOnBlur} onChange={handleOnChange} name="HouseRentReceipts"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.HouseRentReceipts.error && <p style={errorStyle}>{state.HouseRentReceipts.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="HouseRentReceiptsComments" disabled={isdisable}  value={state.HouseRentReceiptsComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.HouseRentReceiptsComments.error && <p style={errorStyle}>{state.HouseRentReceiptsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>2. Investement u/s 80C</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Investment80C.value} id="Investment80C" disabled={isdisable}  onBlur={handleOnBlur} onChange={handleOnChange} name="Investment80C"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Investment80C.error && <p style={errorStyle}>{state.Investment80C.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="Investment80cComments" disabled={isdisable}  value={state.Investment80cComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.Investment80cComments.error && <p style={errorStyle}>{state.Investment80cComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>3. Housing Loan</td>
                            <td>
                                <FormControl>
                                    <Select value={state.HousingLoan.value} disabled={isdisable} id="HousingLoan" onBlur={handleOnBlur} onChange={handleOnChange} name="HousingLoan"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.HousingLoan.error && <p style={errorStyle}>{state.HousingLoan.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="HousingLoanComments" disabled={isdisable}  value={state.HousingLoanComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.HousingLoanComments.error && <p style={errorStyle}>{state.HousingLoanComments.error}</p>}
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

export default FinanceClearance;