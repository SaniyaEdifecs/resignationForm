import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';


const FinanceClearance = (props) => {
    console.log("ITclearace");
    const submitITClearance = (e) => {
        e.preventDefault();
        console.log("event");
    };
    return (
        <div>
            <Typography variant="h5" component="h5">
                Finance Clearance
            </Typography>
            <form onSubmit={submitITClearance} className="clearanceForm">
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
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Travel Advance/Expenses</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Telephone Reimbursement</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Revoke all confedential Information(credit cards, debit card, bank account login credentials etc)</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Talentoz Access</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Investement Proofs as required for income tax</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>1. House Rent Receipts</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>2. Investement u/s 80C</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>3. Housing Loan</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td colSpan={3} >
                                <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button>
                                <Button type="submit" className="marginTop16" variant="contained" color="secondary">Save</Button>
                                <Button type="submit" className="marginTop16" variant="contained" color="primary">Dues Complete</Button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default FinanceClearance;