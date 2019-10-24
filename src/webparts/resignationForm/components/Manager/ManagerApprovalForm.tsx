import * as React from 'react';
import { useState } from 'react';
import { Radio, RadioGroup, Button, FormControlLabel, FormControl, TextField } from '@material-ui/core/';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { sp, ItemAddResult } from '@pnp/sp';
import useForm from '../Manager/ManagersUseForm';

const ManagerApprovalForm = () => {
    const [LastWorkingDate, setDate] = useState(null);
    // Define your state schema
    const formFields = [
        "Status",
        "ResponsetoAssociate",
        "Reason",
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

    const [expanded, setExpanded] = React.useState();
    let userDetails: any = {};

    const handlePanelChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleDateChange = (event) => {
        // this.setState({LastWorkingDate:event});
        setDate(event);
        console.log("=======", LastWorkingDate);

    };

    sp.web.lists.getByTitle("ManagersResponse").items.get().then((items: any) => {
    });

    const onSubmitForm = (value) => {
        for (const key in value) {
            value[key] = value[key].value;
        }
        sp.web.currentUser.get().then((response) => {
            let userId = response.Id;
            value = { ...value, 'ID': userId, 'LastWorkingDate': LastWorkingDate };
            console.log("onsubmit", value);
            sp.web.lists.getByTitle("ManagersResponse").items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    console.log('submitted', item);
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });

        });
    }
    const { state, disable, handleOnChange, handleOnSubmit } = useForm(
        stateSchema, {}, onSubmitForm
    );
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

                <form className="mWrapper" onSubmit={handleOnSubmit}>
                    <FormControl component="fieldset" >
                        <RadioGroup aria-label="Accept" name="Status" value={state.Status.value} onChange={handleOnChange}>
                            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handlePanelChange('panel1')}>
                                <ExpansionPanelSummary aria-controls="panel1bh-content" id="panel1bh-header">
                                    <Typography >
                                        <FormControlLabel value="Accepted"
                                            control={<Radio color="primary" />}
                                            label="Accept" 
                                            labelPlacement="start" onChange={handleOnChange} />
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Typography>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                            <DatePicker label="Last Working Date" className="fullWidth" format="MM-dd-yyyy"
                                                value={LastWorkingDate} name="LastWorkingDate" onChange={handleDateChange} />
                                        </MuiPickersUtilsProvider>
                                    </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>

                            <ExpansionPanel expanded={expanded == 'panel2'} onChange={handlePanelChange('panel2')}>
                                <ExpansionPanelSummary aria-controls="panel2bh-content" id="panel2bh-header">
                                    <Typography >
                                        <FormControlLabel
                                            value="Rejected"
                                            control={<Radio color="primary" />}
                                            label="Reject"
                                            labelPlacement="start" onChange={handleOnChange}
                                        />
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Typography>
                                        <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Response to Associate" name="ResponsetoAssociate" onChange={handleOnChange} />
                                        {/* {state.ResignationSummary.error && <p style={errorStyle}>{state.ResignationSummary.error}</p>} */}
                                        <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Reason" name="Reason" helperText="For Internal Use To HR Partner" onChange={handleOnChange} />
                                    </Typography>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <ExpansionPanel expanded={expanded == 'panel3'} onChange={handlePanelChange('panel3')}>
                                <ExpansionPanelSummary aria-controls="panel3bh-content" id="panel3bh-header">
                                    <Typography >
                                        <FormControlLabel
                                            value="On Hold"
                                            control={<Radio color="primary" />}
                                            label="I want to put the Resignation On Hold"
                                            labelPlacement="start" onChange={handleOnChange}
                                        /></Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails></ExpansionPanelDetails>
                            </ExpansionPanel>
                        </RadioGroup>
                    </FormControl>
                    <Button type="submit" disabled={disable} fullWidth className="marginTop16 maxWidth" variant="contained" color="primary">Submit</Button>
                </form>
            </section>
        </div>);

};

export default ManagerApprovalForm;