import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';

const OperationsAdminClearance=(props)=>{
    console.log("ITclearace");
    const submitITClearance = (e) => {
        e.preventDefault();
        console.log("event");
    };
    return (
        <div>
            <Typography variant="h5" component="h5">
                Operations Clearance
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
                            <td>Pedestal Keys</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Car/Bikes Stickers</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Library Books</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Sim Card</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Visiting Cards</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Kuoni & Concur Access</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Biometric Access</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Others(specify)</td>
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

export default OperationsAdminClearance;