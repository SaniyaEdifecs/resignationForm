import * as React from 'react';
import { useState, useEffect } from 'react';
import { Radio, RadioGroup, Button, FormControlLabel, FormControl, FormLabel, Container, TextField } from '@material-ui/core/';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { sp } from '@pnp/sp';
const ManagerApprovalForm = () => {
    const [value, setValue] = useState();
    const [LastWorkingDate, setDate] = useState(null);


    let userDetails: any = {};
    const handleChange = event => {
        setValue(event.target.value);
    };


    const handleDateChange = (event) => {
        setDate(event);
    }
    // current user email id
    sp.web.currentUser.get().then((response) => {
        // console.log("Current user details", response)
        let userId = response.Id;
        // get a specific item by id
        if (userId) {
            sp.web.lists.getByTitle("Resignations").items.getById(userId).get().then((items: any) => {
                userDetails = items;
                // console.log("get a specific item by id", userDetails);
                // setInputs(userDetails);

            });
        }

    });
    return (
        <div >
            <header>
                Hello
             </header>
            <section>
                This is to inform you that Mr/Mrs XYZ having employee Code #### has submitted a request for resignation from the post of 'Title'. The resignation details provided by the employee are as below:
                <table cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>Reason For resignation</th>
                            <td>{userDetails.ResignationReason}</td>
                        </tr>
                        <tr>
                            <th>Department</th>
                            <td>{userDetails.Title}</td>
                        </tr>
                        <tr>
                            <th>Resignation Date</th>
                            <td>{userDetails.Created}</td>
                        </tr>
                        <tr>
                            <th>Resignation Details</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Personal Email</th>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <p>Please have a conversation with the associate and guide for the next step.</p>
                <Container>
                    <form className="mWrapper">
                        <FormControl component="fieldset" >
                        <RadioGroup aria-label="Accept" name="Accept" value={value} onChange={handleChange}>
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header" >
                                    <Typography >
                                      
                                        <FormControlLabel value="Accept"
                                            control={<Radio color="primary" />}
                                            label="Accept"
                                            labelPlacement="start"
                                        />
                                            
                                    </Typography>
                                </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                                <DatePicker label="Last Working Date" className="fullWidth" format="MM-dd-yyyy"
                                                    value={LastWorkingDate} name="LastWorkingDate" required onChange={handleDateChange} />
                                            </MuiPickersUtilsProvider>
                                        </Typography>
                                    </ExpansionPanelDetails>
                            </ExpansionPanel>

                                <FormControlLabel
                                    value="Reject"
                                    control={<Radio color="primary" />}
                                    label="Reject"
                                    labelPlacement="start"
                                />

                                <FormControlLabel
                                    value="other"
                                    control={<Radio color="primary" />}
                                    label="I want to put the Resignation On Hold"
                                    labelPlacement="start"
                                />
                        </RadioGroup>
                        </FormControl>
                        <Button type="submit" fullWidth className="marginTop16" variant="contained" color="primary">Submit</Button>
                    </form>
                </Container>
            </section>
        </div>);

};

export default ManagerApprovalForm;