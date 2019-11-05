import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Radio, RadioGroup, Button, FormControlLabel, FormControl, TextField } from '@material-ui/core/';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import { sp, ItemAddResult } from '@pnp/sp';
import useForm from '../Manager/ManagersUseForm';
import moment from 'moment';

const ManagerApprovalForm = (props) => {
    let ID = props.props;
    let list = sp.web.lists;
    const [LastWorkingDate, setDate] = useState(null);
    const [employeeDetail, setData] = useState();
    const [expanded, setExpanded] = useState();
   
    // Define your state schema
    const formFields = ["Status","ResponsetoAssociate","Reason" ];
    var stateSchema =  {};
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
    const handlePanelChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        setState(stateSchema);
        setDate(null);
        console.log("panel===");
    };
    const handleDateChange = (event) => {
        setDate(event);
        console.log("=======", LastWorkingDate);
    };

    const getUserResigationdata = (ID) => {
        sp.web.lists.getByTitle("ManagersResponse").items.get().then((response:any)=>{
            console.log("response", response);
        })

        sp.web.lists.getByTitle("ResignationList").items.getById(ID).get().then((response: any) => {
            console.log(response);
            setData(response);
        },
        error => {
            console.log(error);
        });
    }
    useEffect(() => {
        if (ID) {
            getUserResigationdata(ID);
        }
    }, []);

    const onSubmitForm = (value) => {
        for (const key in value) {
            value[key] = value[key].value;
        }
            value = { ...value, 'ID': ID, 'LastWorkingDate': LastWorkingDate, "EmployeeName":  employeeDetail['FirstName'] + " " + employeeDetail['LastName'], 'EmployeeCode': employeeDetail.EmployeeCode};
            console.log("onsubmit", value);
            sp.web.lists.getByTitle("ManagersResponse").items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    console.log('submitted', item);
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });

    }
    const { state, disable, setState,handleOnChange, handleOnSubmit } = useForm(
        stateSchema, {}, onSubmitForm
    );
    return (
        <div >
            <header>
                Hello
             </header>
            <section>
                {employeeDetail ? <div>
                    This is to inform you that Mr/Mrs {employeeDetail['FirstName'] + " " + employeeDetail['LastName']} having employee Code {employeeDetail.EmployeeCode} has submitted a request for resignation from the post of '{employeeDetail.JobTitle}'. The resignation details provided by the employee are as below:
                <table cellPadding="0" cellSpacing="0">
                        <tbody>
                            <tr>
                                <th>Reason For resignation</th>
                                <td>{employeeDetail.ResignationReason}</td>
                            </tr>
                            <tr>
                                <th>Department</th>
                                <td>{employeeDetail.JobTitle}</td>
                            </tr>
                            <tr>
                                <th>Resignation Date</th>
                                <td>{moment(employeeDetail.Created).format("MMM Do YYYY")}</td>
                            </tr>
                            <tr>
                                <th>Resignation Details</th>
                                <td>{employeeDetail.ResignationSummary}</td>
                            </tr>
                            <tr>
                                <th>Personal Email</th>
                                <td>{employeeDetail.PersonalEmail}</td>
                            </tr>
                        </tbody>
                    </table>
                </div> : <div>No data</div>}
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
                                        <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Response to Associate" name="ResponsetoAssociate" value={state.ResponsetoAssociate.value} onChange={handleOnChange} />
                                        {/* {state.ResignationSummary.error && <p style={errorStyle}>{state.ResignationSummary.error}</p>} */}
                                        <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Reason" name="Reason" helperText="For Internal Use To HR Partner" value={state.Reason.value} onChange={handleOnChange} />
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