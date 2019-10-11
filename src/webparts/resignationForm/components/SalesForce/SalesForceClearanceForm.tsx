import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';


const SalesForceClearance = (props) => {
    console.log("ITclearace");
    const submitITClearance = (e) => {
        e.preventDefault();
        console.log("event");
    };
    return (
        <div>
            <Typography variant="h5" component="h5">
                SalesForce Clearance
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
                            <td>SFDC License Termination: Kiranpreet Kaur</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td colSpan={3} >
                                <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button>
                                <Button type="submit" className="marginTop16" variant="contained" color="primary">Dues Complete</Button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default SalesForceClearance;