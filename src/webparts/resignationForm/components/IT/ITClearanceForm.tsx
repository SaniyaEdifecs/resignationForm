import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { sp } from '@pnp/sp';


const ItClearance = (props) => {
    console.log("ITclearace");
    sp.web.lists.getByTitle("ManagersResponse").items.get().then((items: any) => {
        console.log("IT items",items);
    });
    const submitITClearance = (e) => {
        e.preventDefault();
        console.log("event");
    };
    return (
        <div>
            <Typography variant="h5" component="h5">
                IT Clearance
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
                            <td>Mailbox and important data back-up</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Access Removal (Email, User Account, All applications)</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Phone & SIM/Data card</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Laptop/Desktop/Dock Station</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Access Card</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>ID Card</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Others- Chargers, mouse, headphones etc</td>
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

export default ItClearance;