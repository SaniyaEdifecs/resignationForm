import * as React from 'react';
import { Typography, TextField, Button, InputLabel, MenuItem, FormControl, Select, FormControlLabel, Checkbox } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
import useForm from '../UseForm';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';
// import useCustomFunc, { getStatusdetails } from '../utils';

const HrClearance = (props) => {
    let ID = props.props;
    let detail: any;
    let list = sp.web.lists.getByTitle("HrClearance");
    const [isUserExist, setUserExistence] = useState(false);
    const [hideButton, setButtonVisibility] = useState();
    const [duesPending, setDuesPending] = useState();
    // const [hideButton, setButtonVisibility] = useState();
    const [isDisable, setDisable] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "Deductions", "DeductionsComments", "ELBalance", "ELBalanceComments", "Ex_x002d_Gratia", "Ex_x002d_GratiaComments", "ExitInterview", "ExitInterviewComments", "Gratuity", "GratuityComments", "Insurance", "InsuranceComments", "LeaveEncashment", "LeaveEncashmentComments", "Relocation_x002f_ReferralBonus", "Relocation_x002f_ReferralBonusCo", "ServiceLetter", "ServiceLetterComments", "ShiftAllowance", "ShiftAllowanceComments", "Sign_x002d_onBonus", "Sign_x002d_onBonusComments", "TelephoneAllowance", "TelephoneAllowanceComments", "TerminateOnHRSystems", "TerminateOnHRSystemsComments"
    ];
    var stateSchema = {};
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

    useEffect(() => {
        if (ID) {
            getEmployeeClearanceDetails(ID);
        }
    }, []);

    const getStatusdetails = (status) => {
        switch (status) {
            case "null":
                setButtonVisibility(true);
                setStatus("Pending");
                break;
            case "Pending":
                setButtonVisibility(true);
                break;
            case "Approved":
                setDisable(true);
                break;
            default:
                setButtonVisibility(false);
                break;
        }
    };


    const getEmployeeClearanceDetails = (employeeID) => {
        list.items.getById(employeeID).get().then((response: any) => {
            detail = response;
            console.log(detail)
            getStatusdetails(detail.Status);
            setUserExistence(true);
            formFields.forEach(formField => {
                if (detail[formField] == null) {
                    stateSchema[formField].value = "";
                    stateSchema[formField].error = "";
                } else {
                    stateSchema[formField].value = detail[formField] + "";
                    stateSchema[formField].error = "";
                }
            });
            setState(prevState => ({ ...prevState, stateSchema }));
            console.log("getdetail", stateSchema);
        }, (error: any): void => {
            setButtonVisibility(true);
            console.log('Error while creating the item: ' + error);
        });
    };

    const onSubmitForm = (value) => {
        showLoader(true);
        for (const key in value) {
            value[key] = value[key].value;
        }
        value = { ...value, 'Status': status };
        if (isUserExist) {
            list.items.getById(ID).update(value).then(i => {
                showLoader(false);
                getEmployeeClearanceDetails(ID);

            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        } else {
            value = { ...value, ID };
            list.items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    showLoader(false);
                    getEmployeeClearanceDetails(ID);
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        }
    };

    const { state, setState, disable, status, setStatus, saveForm, handleOnChange, handleOnBlur, handleOnSubmit } = useForm(
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
            {loader ? <div className="loaderWrapper"><CircularProgress /></div> : null}
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
                                <FormControl>
                                    <Select value={state.ExitInterview.value} disabled={isDisable} id="ExitInterview" onBlur={handleOnBlur} onChange={handleOnChange} name="ExitInterview"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ExitInterview.error && <p style={errorStyle}>{state.ExitInterview.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ExitInterviewComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.ExitInterviewComments.value} />
                                {state.ExitInterviewComments.error && <p style={errorStyle}>{state.ExitInterviewComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Relocation/Referral Bonus</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Relocation_x002f_ReferralBonus.value} disabled={isDisable} id="Relocation_x002f_ReferralBonus" onBlur={handleOnBlur} onChange={handleOnChange} name="Relocation_x002f_ReferralBonus"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Relocation_x002f_ReferralBonus.error && <p style={errorStyle}>{state.Relocation_x002f_ReferralBonus.error}</p>}
                                </FormControl>
                            </td>
                            <td> 
                                <TextField margin="normal" name="Relocation_x002f_ReferralBonusCo" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.Relocation_x002f_ReferralBonusCo.value} />
                                {state.Relocation_x002f_ReferralBonusCo.error && <p style={errorStyle}>{state.Relocation_x002f_ReferralBonusCo.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Sign-on Bonus</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Sign_x002d_onBonus.value} id="Sign_x002d_onBonus" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} name="Sign_x002d_onBonus"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Sign_x002d_onBonus.error && <p style={errorStyle}>{state.Sign_x002d_onBonus.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="Sign_x002d_onBonusComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.Sign_x002d_onBonusComments.value} />
                                {state.Sign_x002d_onBonusComments.error && <p style={errorStyle}>{state.Sign_x002d_onBonusComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Ex-Gratia</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Ex_x002d_Gratia.value} id="Ex_x002d_Gratia" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} name="Ex_x002d_Gratia"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Ex_x002d_Gratia.error && <p style={errorStyle}>{state.Ex_x002d_Gratia.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="Ex_x002d_GratiaComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.Ex_x002d_GratiaComments.value} />
                                {state.Ex_x002d_GratiaComments.error && <p style={errorStyle}>{state.Ex_x002d_GratiaComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>EL Balance</td>
                            <td>
                                <FormControl>
                                    <Select value={state.ELBalance.value} id="ELBalance" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} name="ELBalance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ELBalance.error && <p style={errorStyle}>{state.ELBalance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ELBalanceComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.ELBalanceComments.value} />
                                {state.ELBalanceComments.error && <p style={errorStyle}>{state.ELBalanceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Leave Encashment</td>
                            <td>
                                <FormControl>
                                    <Select value={state.LeaveEncashment.value} disabled={isDisable} id="LeaveEncashment" onBlur={handleOnBlur} onChange={handleOnChange} name="LeaveEncashment"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.LeaveEncashment.error && <p style={errorStyle}>{state.LeaveEncashment.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="LeaveEncashmentComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.LeaveEncashmentComments.value} />
                                {state.LeaveEncashmentComments.error && <p style={errorStyle}>{state.LeaveEncashmentComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Shift Allowance</td>
                            <td>
                                <FormControl>
                                    <Select value={state.ShiftAllowance.value} disabled={isDisable} id="ShiftAllowance" onBlur={handleOnBlur} onChange={handleOnChange} name="ShiftAllowance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ShiftAllowance.error && <p style={errorStyle}>{state.ShiftAllowance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ShiftAllowanceComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.ShiftAllowanceComments.value} />
                                {state.ShiftAllowanceComments.error && <p style={errorStyle}>{state.ShiftAllowanceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Telephone Allowance</td>
                            <td>
                                <FormControl>
                                    <Select value={state.TelephoneAllowance.value} disabled={isDisable} id="TelephoneAllowance" onBlur={handleOnBlur} onChange={handleOnChange} name="TelephoneAllowance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TelephoneAllowance.error && <p style={errorStyle}>{state.TelephoneAllowance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TelephoneAllowanceComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.TelephoneAllowanceComments.value} />
                                {state.TelephoneAllowanceComments.error && <p style={errorStyle}>{state.TelephoneAllowanceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Terminate On Hr Systems</td>
                            <td>
                                <FormControl>
                                    <Select value={state.TerminateOnHRSystems.value} disabled={isDisable} id="TerminateOnHRSystems" onBlur={handleOnBlur} onChange={handleOnChange} name="TerminateOnHRSystems"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TerminateOnHRSystems.error && <p style={errorStyle}>{state.TerminateOnHRSystems.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TerminateOnHRSystemsComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.TerminateOnHRSystemsComments.value} />
                                {state.TerminateOnHRSystemsComments.error && <p style={errorStyle}>{state.TerminateOnHRSystemsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Service Letter</td>
                            <td>
                                <FormControl>
                                    <Select value={state.ServiceLetter.value} id="ServiceLetter" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} name="ServiceLetter"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ServiceLetter.error && <p style={errorStyle}>{state.ServiceLetter.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ServiceLetterComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.ServiceLetterComments.value} />
                                {state.ServiceLetterComments.error && <p style={errorStyle}>{state.ServiceLetterComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Gratuity</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Gratuity.value} id="Gratuity" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} name="Gratuity"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Gratuity.error && <p style={errorStyle}>{state.Gratuity.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="GratuityComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.GratuityComments.value} />
                                {state.GratuityComments.error && <p style={errorStyle}>{state.GratuityComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Deductions</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Deductions.value} id="Deductions" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} name="Deductions"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Deductions.error && <p style={errorStyle}>{state.Deductions.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DeductionsComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.DeductionsComments.value} />
                                {state.DeductionsComments.error && <p style={errorStyle}>{state.DeductionsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Insurance</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Insurance.value} id="Insurance" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} name="Insurance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Insurance.error && <p style={errorStyle}>{state.Insurance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="InsuranceComments" disabled={isDisable} onBlur={handleOnBlur} onChange={handleOnChange} value={state.InsuranceComments.value} />
                                {state.InsuranceComments.error && <p style={errorStyle}>{state.InsuranceComments.error}</p>}
                            </td>
                        </tr>
                        {hideButton ? <tr>
                            <td colSpan={3} >
                                {disable == true ? <div className="inlineBlock">
                                    <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save</Button>
                                    <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Submit</Button></div> :
                                    <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Submit</Button>}
                            </td>

                        </tr> : null}
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default HrClearance;