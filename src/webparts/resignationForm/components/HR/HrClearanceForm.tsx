import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useForm from '../UseForm';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import '../CommonStyleSheet.scss';


const HrClearance = (props) => {
    // const classes = useStyles(0);
    let userID = props.props;
    const [isUserExist, setUserExistence] = useState(false);
    const [formView, setView] = useState(false);
    let list = sp.web.lists.getByTitle("HrClearance");
    const formFields = [
        "Deductions", "DeductionsComments", "ELBalance", "ELBalanceComments", "Ex_x002d_Gratia", "Ex_x002d_GratiaComments", "ExitInterview", "ExitInterviewComments", "Gratuity", "GratuityComments", "Insurance", "InsuranceComments", "LeaveEncashment", "LeaveEncashmentComments", "Relocation_x002f_ReferralBonus", "Relocation_x002f_ReferralBonusCo", "ServiceLetter", "ServiceLetterComments", "ShiftAllowance", "ShiftAllowanceComments", "Sign_x002d_onBonus", "Sign_x002d_onBonusComments", "TelephoneAllowance", "TelephoneAllowanceComments", "TerminateOnHRSystems", "TerminateOnHRSystemsComments"
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
        list.items.getById(employeeID).get().then((detail: any) => {
            setUserExistence(true);
            console.log("\n\n\nemployee Clearance saved details - \n\n\n", detail);
            formFields.forEach(formField => {
                stateSchema[formField].value = detail[formField] + "";
            });
            setState(prevState => ({ ...prevState, stateSchema }));
            console.log("\n\n\nstateSchema - \n\n\n", stateSchema);
        });
    }

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
            list.items.getById(userID).update(state).then(i => {
                // setView(true);
                // setState(stateSchema);
            });
        } else {
            let ID = userID;
            value = { ...value, ID };
            console.log("onsubmit", value);
            list.items.add(value).then((response: ItemAddResult): void => {
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
    }

    const { state, setState, disable, saveForm, handleOnChange, handleOnBlur, handleOnSubmit } = useForm(
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
                HR Clearance
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
                            <td>Exit Interview</td>
                            <td>
                                <TextField margin="normal" name="ExitInterview" onBlur={handleOnBlur} onChange={handleOnChange} value={state.ExitInterview.value} />
                                {state.ExitInterview.error && <p style={errorStyle}>{state.ExitInterview.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="ExitInterviewComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.ExitInterviewComments.value} />
                                {state.ExitInterviewComments.error && <p style={errorStyle}>{state.ExitInterviewComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Relocation/Referral Bonus</td>
                            <td>
                                <TextField margin="normal" name="Relocation_x002f_ReferralBonus" onBlur={handleOnBlur} onChange={handleOnChange} value={state.Relocation_x002f_ReferralBonus.value} />
                                {state.Relocation_x002f_ReferralBonus.error && <p style={errorStyle}>{state.Relocation_x002f_ReferralBonus.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="Relocation_x002f_ReferralBonusCo" onBlur={handleOnBlur} onChange={handleOnChange} value={state.Relocation_x002f_ReferralBonusCo.value} />
                                {state.Relocation_x002f_ReferralBonusCo.error && <p style={errorStyle}>{state.Relocation_x002f_ReferralBonusCo.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Sign-on Bonus</td>
                            <td>
                                <TextField margin="normal" name="Sign_x002d_onBonus" onBlur={handleOnBlur} onChange={handleOnChange} value={state.Sign_x002d_onBonus.value} />
                                {state.Sign_x002d_onBonus.error && <p style={errorStyle}>{state.Sign_x002d_onBonus.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="Sign_x002d_onBonusComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.Sign_x002d_onBonusComments.value} />
                                {state.Sign_x002d_onBonusComments.error && <p style={errorStyle}>{state.Sign_x002d_onBonusComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Ex-Gratia</td>
                            <td>
                                <TextField margin="normal" name="Ex_x002d_Gratia" onBlur={handleOnBlur} onChange={handleOnChange} value={state.Ex_x002d_Gratia.value} />
                                {state.Ex_x002d_Gratia.error && <p style={errorStyle}>{state.Ex_x002d_Gratia.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="Ex_x002d_GratiaComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.Ex_x002d_GratiaComments.value} />
                                {state.Ex_x002d_GratiaComments.error && <p style={errorStyle}>{state.Ex_x002d_GratiaComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>EL Balance</td>
                            <td>
                                <TextField margin="normal" name="ELBalance" onBlur={handleOnBlur} onChange={handleOnChange} value={state.ELBalance.value} />
                                {state.ELBalance.error && <p style={errorStyle}>{state.ELBalance.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="ELBalanceComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.ELBalanceComments.value} />
                                {state.ELBalanceComments.error && <p style={errorStyle}>{state.ELBalanceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Leave Encashment</td>
                            <td>
                                <TextField margin="normal" name="LeaveEncashment" onBlur={handleOnBlur} onChange={handleOnChange} value={state.LeaveEncashment.value} />
                                {state.LeaveEncashment.error && <p style={errorStyle}>{state.LeaveEncashment.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="LeaveEncashmentComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.LeaveEncashmentComments.value} />
                                {state.LeaveEncashmentComments.error && <p style={errorStyle}>{state.LeaveEncashmentComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Shift Allowance</td>
                            <td>
                                <TextField margin="normal" name="ShiftAllowance" onBlur={handleOnBlur} onChange={handleOnChange} value={state.ShiftAllowance.value} />
                                {state.ShiftAllowance.error && <p style={errorStyle}>{state.ShiftAllowance.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="ShiftAllowanceComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.ShiftAllowanceComments.value} />
                                {state.ShiftAllowanceComments.error && <p style={errorStyle}>{state.ShiftAllowanceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Telephone Allowance</td>
                            <td>
                                <TextField margin="normal" name="TelephoneAllowance" onBlur={handleOnBlur} onChange={handleOnChange} value={state.TelephoneAllowance.value} />
                                {state.TelephoneAllowance.error && <p style={errorStyle}>{state.TelephoneAllowance.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="TelephoneAllowanceComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.TelephoneAllowanceComments.value} />
                                {state.TelephoneAllowanceComments.error && <p style={errorStyle}>{state.TelephoneAllowanceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Terminate On Hr Systems</td>
                            <td>
                                <TextField margin="normal" name="TerminateOnHRSystems" onBlur={handleOnBlur} onChange={handleOnChange} value={state.TerminateOnHRSystems.value} />
                                {state.TerminateOnHRSystems.error && <p style={errorStyle}>{state.TerminateOnHRSystems.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="TerminateOnHRSystemsComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.TerminateOnHRSystemsComments.value} />
                                {state.TerminateOnHRSystemsComments.error && <p style={errorStyle}>{state.TerminateOnHRSystemsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Service Letter</td>
                            <td>
                                <TextField margin="normal" name="ServiceLetter" onBlur={handleOnBlur} onChange={handleOnChange} value={state.ServiceLetter.value} />
                                {state.ServiceLetter.error && <p style={errorStyle}>{state.ServiceLetter.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="ServiceLetterComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.ServiceLetterComments.value} />
                                {state.ServiceLetterComments.error && <p style={errorStyle}>{state.ServiceLetterComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Gratuity</td>
                            <td>
                                <TextField margin="normal" name="Gratuity" onBlur={handleOnBlur} onChange={handleOnChange} value={state.Gratuity.value} />
                                {state.Gratuity.error && <p style={errorStyle}>{state.Gratuity.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="GratuityComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.GratuityComments.value} />
                                {state.GratuityComments.error && <p style={errorStyle}>{state.GratuityComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Deductions</td>
                            <td>
                                <TextField margin="normal" name="Deductions" onBlur={handleOnBlur} onChange={handleOnChange} value={state.Deductions.value} />
                                {state.Deductions.error && <p style={errorStyle}>{state.Deductions.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="DeductionsComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.DeductionsComments.value} />
                                {state.DeductionsComments.error && <p style={errorStyle}>{state.DeductionsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Insurance</td>
                            <td>
                                <TextField margin="normal" name="Insurance" onBlur={handleOnBlur} onChange={handleOnChange} value={state.Insurance.value} />
                                {state.Insurance.error && <p style={errorStyle}>{state.Insurance.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="InsuranceComments" onBlur={handleOnBlur} onChange={handleOnChange} value={state.InsuranceComments.value} />
                                {state.InsuranceComments.error && <p style={errorStyle}>{state.InsuranceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3} >
                                {disable == true ? <div className="inlineBlock">
                                    <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save</Button> 
                                     <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Submit</Button></div> :
                                    <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Submit</Button>}
                            </td>

                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default HrClearance;