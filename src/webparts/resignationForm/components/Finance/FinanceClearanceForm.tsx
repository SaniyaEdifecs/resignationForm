import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useForm from '../UseForm';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import '../CommonStyleSheet.scss';  

const FinanceClearance = (props) => {
    // const classes = useStyles(0);
    let userID = props.props;
    const [isUserExist, setUserExistence] = useState(false);
    const [formView, setView] = useState(false);
    const formFields = [
        "ConfidentialInfoComments", "ConfidentialInformation", "HouseRentReceipts", "HouseRentReceiptsComments", "HousingLoan", "HousingLoanComments", "Investment80C", "Investment80cComments", "InvestmentProofs", "InvestmentProofsComments", "Loan_x002f_ImprestBalance", "Loan_x002f_ImprestBalanceComment", "TalentozAccess", "TalentozAccessComments", "TelephoneReimbursement", "TelephoneReimbursementComments", "TravelAdvance_x002f_Expenses", "TravelAdvance_x002f_ExpensesComm"
    ];

    var stateSchema = {
    };

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
    const getEmployeeClearanceDetails = (employeeID) => {
        sp.web.lists.getByTitle("Finance%20Clearance").items.getById(employeeID).get().then((detail: any) => {
            setUserExistence(true);
            formFields.forEach(formField => {
                stateSchema[formField].value = detail[formField] + "";
            });
            setState(prevState => ({ ...prevState, stateSchema }));
        });
    };

    useEffect(() => {
        if (userID) {
            getEmployeeClearanceDetails(userID);
        }
    }, []);
  

    const onSubmitForm = (value) => {
        for (const key in value) {
            value[key] = value[key].value;
        }
        if (isUserExist) {
            let list = sp.web.lists.getByTitle("Finance%20Clearance");
            list.items.getById(userID).update(state).then(i => {
                // setView(true);
                // setState(stateSchema);
            });
        } else {
                let ID = userID;
                value = { ...value, ID };
                console.log("onsubmit", value);

                sp.web.lists.getByTitle("Finance%20Clearance").items.add(value).then((response: ItemAddResult): void => {
                    const item = response.data as string;
                    if (item) {
                        console.log('submitted', item);
                        // setView(true);
                        // setState(stateSchema);
                    }
                }, (error: any): void => {
                    console.log('Error while creating the item: ' + error);
                });
        }
    };

    const { state, setState, disable, handleOnChange, handleOnBlur, handleOnSubmit, saveForm } = useForm(
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
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="Loan_x002f_ImprestBalance" value={state.Loan_x002f_ImprestBalance.value} />
                                {state.Loan_x002f_ImprestBalance.error && <p style={errorStyle}>{state.Loan_x002f_ImprestBalance.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="Loan_x002f_ImprestBalanceComment" value={state.Loan_x002f_ImprestBalanceComment.value} />
                                {state.Loan_x002f_ImprestBalanceComment.error && <p style={errorStyle}>{state.Loan_x002f_ImprestBalanceComment.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Travel Advance/Expenses</td>
                            <td>
                                <TextField margin="normal" name="TravelAdvance_x002f_Expenses" value={state.TravelAdvance_x002f_Expenses.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TravelAdvance_x002f_Expenses.error && <p style={errorStyle}>{state.TravelAdvance_x002f_Expenses.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="TravelAdvance_x002f_ExpensesComm" value={state.TravelAdvance_x002f_ExpensesComm.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TravelAdvance_x002f_ExpensesComm.error && <p style={errorStyle}>{state.TravelAdvance_x002f_ExpensesComm.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Telephone Reimbursement</td>
                            <td>
                                <TextField margin="normal" name="TelephoneReimbursement" value={state.TelephoneReimbursement.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TelephoneReimbursement.error && <p style={errorStyle}>{state.TelephoneReimbursement.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="TelephoneReimbursementComments" value={state.TelephoneReimbursementComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TelephoneReimbursementComments.error && <p style={errorStyle}>{state.TelephoneReimbursementComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Revoke all confedential Information(credit cards, debit card, bank account login credentials etc)</td>
                            <td>
                                <TextField margin="normal" name="ConfidentialInformation" value={state.ConfidentialInformation.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.ConfidentialInformation.error && <p style={errorStyle}>{state.ConfidentialInformation.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="ConfidentialInfoComments" value={state.ConfidentialInfoComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.ConfidentialInfoComments.error && <p style={errorStyle}>{state.ConfidentialInfoComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Talentoz Access</td>
                            <td>
                                <TextField margin="normal" name="TalentozAccess" value={state.TalentozAccess.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TalentozAccess.error && <p style={errorStyle}>{state.TalentozAccess.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="TalentozAccessComments" value={state.TalentozAccessComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.TalentozAccessComments.error && <p style={errorStyle}>{state.TalentozAccessComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Investement Proofs as required for income tax</td>
                            <td>
                                <TextField margin="normal" name="InvestmentProofs" value={state.InvestmentProofs.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.InvestmentProofs.error && <p style={errorStyle}>{state.InvestmentProofs.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="InvestmentProofsComments" value={state.InvestmentProofsComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.InvestmentProofsComments.error && <p style={errorStyle}>{state.InvestmentProofsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>1. House Rent Receipts</td>
                            <td>
                                <TextField margin="normal" name="HouseRentReceipts" value={state.HouseRentReceipts.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.HouseRentReceipts.error && <p style={errorStyle}>{state.HouseRentReceipts.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="HouseRentReceiptsComments" value={state.HouseRentReceiptsComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.HouseRentReceiptsComments.error && <p style={errorStyle}>{state.HouseRentReceiptsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>2. Investement u/s 80C</td>
                            <td>
                                <TextField margin="normal" name="Investment80C" value={state.Investment80C.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.Investment80C.error && <p style={errorStyle}>{state.Investment80C.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="Investment80cComments" value={state.Investment80cComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.Investment80cComments.error && <p style={errorStyle}>{state.Investment80cComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>3. Housing Loan</td>
                            <td>
                                <TextField margin="normal" name="HousingLoan" value={state.HousingLoan.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.HousingLoan.error && <p style={errorStyle}>{state.HousingLoan.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="HousingLoanComments" value={state.HousingLoanComments.value} onChange={handleOnChange} onBlur={handleOnBlur} required />
                                {state.HousingLoanComments.error && <p style={errorStyle}>{state.HousingLoanComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3} >
                                <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button>
                                {disable == true ? <div className="inlineBlock">
                                    <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save</Button>
                                    <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>
                                </div> : <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default FinanceClearance;