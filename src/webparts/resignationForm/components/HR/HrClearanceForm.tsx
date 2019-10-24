import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
// import useForm from '../UseForm';

const HrClearance = (props) => {
    console.log("ITclearace");

 
    return (
        <div>
            <Typography variant="h5" component="h5">
                HR Clearance
            </Typography>
            <form className="clearanceForm">
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
                            <td>Exit Interview</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Relocation/Referral Bonus</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Sign-on Bonus</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Ex-Gratia</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>EL Balance</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Leave Encashment</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Shift Allowance</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Telephone Allowance</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Terminate On Hr Systems</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Service Letter</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Gratuity</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Deductions</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td>Insurance</td>
                            <td><TextField margin="normal" /></td>
                            <td><TextField margin="normal" /></td>
                        </tr>
                        <tr>
                            <td colSpan={3} >
                                <Button type="submit" className="marginTop16" variant="contained" color="secondary">Save</Button>
                                <Button type="submit" className="marginTop16" variant="contained" color="primary">Submit</Button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default HrClearance;