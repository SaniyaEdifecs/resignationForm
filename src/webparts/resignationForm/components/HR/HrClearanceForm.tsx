import * as React from 'react';
import { useEffect, useState } from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, Select, FormControlLabel, RadioGroup, Radio, makeStyles } from '@material-ui/core';
import useForm from '../UseForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';
import * as strings from 'ResignationFormWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Alert } from '@material-ui/lab';
import SharePointService from '../SharePointServices';

const HrClearance = (props) => {
    let ID = props.Id;
    let detail: any;
    let currentUser: any = [];

    const [buttonVisibility, setButtonVisibility] = useState(true);
    const [showMsg, setShowMsg] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = [
        "Resignationemailacceptance", "ResignationAcceptancecomments", "ELBalance", "ELBalanceComments",  "ExitInterview", "ExitInterviewComments", "Gratuity", "GratuityComments",  "Relocation_x002f_ReferralBonus", "Relocation_x002f_ReferralBonusCo", "Sign_x002d_onBonus", "Sign_x002d_onBonusComments",  "TerminateOnHRSystems", "TerminateOnHRSystemsComments", "Waiver", "WaiverComments", "MessageToAssociate", "AdditionalInformation", "DuesPending", "Others", "OthersComments"
    ];

    var stateSchema = {};
    var validationStateSchema = {};
    formFields.forEach(formField => {
        stateSchema[formField] = {};
        stateSchema[formField].value = "";
        stateSchema[formField].error = "";
        validationStateSchema[formField] = {};
        if (formField === 'AdditionalInformation' || formField === 'MessageToAssociate') {
            validationStateSchema[formField].required = false;
        } else {
            validationStateSchema[formField].required = true;
        }

        validationStateSchema[formField].validator = {
            regex: '',
            error: ''
        };

    });
    const onSubmitForm = (value) => {
        showLoader(true);
        let payload = {};
        for (const key in value) {
            payload[key] = value[key].value;
        }

        payload = { ...payload, 'Status': status };
        SharePointService.getListByTitle("HrClearance").items.getById(ID).update(payload).then(items => {
            showLoader(false);
            getEmployeeClearanceDetails(ID);
            // window.location.href = "?component=itClearanceDashboard";
        }, (error: any): void => {
            // console.log('Error while creating the item: ' + error);
        });
    }
    const { state, setState, disable, status, saveForm, handleOnChange, handleOnBlur, handleOnSubmit } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );
    const getEmployeeClearanceDetails = (clearanceId) => {
        SharePointService.getListByTitle("HrClearance").items.getById(clearanceId).get().then((response: any) => {
            detail = response;
            getStatusDetails(detail.Status);
            setEditAccessPermissions(detail.Status);
            formFields.forEach(formField => {
                if (detail[formField] == null) {
                    stateSchema[formField].value = "";
                    stateSchema[formField].error = "";
                } else {
                    stateSchema[formField].value = detail[formField];
                    stateSchema[formField].error = "";
                }
            });
            // // console.log("getdetail", stateSchema);
            setState(prevState => ({ ...prevState, stateSchema }));
        }, (error: any): void => {
            setButtonVisibility(true);
            // console.log('Error while creating the item: ' + error);
        });
    };

    const setEditAccessPermissions = (statusValue) => {
        SharePointService.getCurrentUser().then((response) => {
            currentUser = response;
            if (currentUser) {
                const url = props.context.pageContext.site.absoluteUrl + "/_api/web/lists/getbytitle('HrClearance')/getusereffectivepermissions(@u)?@u='" + encodeURIComponent(currentUser.LoginName) + "'";
                props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
                    .then((response: SPHttpClientResponse): Promise<any> => {
                        return response.json();
                    }).then(permissionResponse => {
                        console.log("permissionResponse:", permissionResponse);
                        let permissionLevel = permissionResponse;
                        if (statusValue == 'Approved' || statusValue == 'Canceled') {
                            SharePointService.getCurrentUserGroups().then((groups: any) => {
                                let isGroupOwner = groups.filter(group => group.Title === "Resignation Group - Owners").length;
                                if (statusValue == 'Approved') {
                                    setReadOnly(isGroupOwner ? false : true);
                                } else {
                                    setReadOnly(isGroupOwner ? true : false);
                                }
                                setButtonVisibility(isGroupOwner ? true : false);
                            });
                        } else {
                            if (permissionLevel.High == 2147483647 && permissionLevel.Low == 4294705151) {
                                setReadOnly(false);
                            } else if (permissionResponse.error ||
                                (permissionLevel.High == 176 && permissionLevel.Low == 138612833) ||
                                (permissionLevel.High == 48 && permissionLevel.Low == 134287360)) {
                                console.log("permissionResponse.error:", permissionResponse.error);
                                setReadOnly(true);
                            }
                        }
                    }, error => {
                        console.log('err', error);
                    });

            }
        });
    }

    const getStatusDetails = (status) => {
        switch (status) {
            case "null" || "Not Started" || "Pending":
                setButtonVisibility(true);
                break;
            case "Approved":
                setReadOnly(true);
                setButtonVisibility(false);
                setEditAccessPermissions('Approved');
                break;
            case "Canceled":
                setShowMsg(true);
                setEditAccessPermissions('Canceled');
                break;
            default:
                setButtonVisibility(true);
                break;
        }
    };
    useEffect(() => {
        if (ID) {
            getEmployeeClearanceDetails(ID);
        }
    }, []);

    useEffect(() => {
        validationStateSchema['MessageToAssociate'].required = state.DuesPending.value === 'NotifyAssociate';
        validationStateSchema['AdditionalInformation'].required = false;

        if (validationStateSchema['MessageToAssociate'].required && !state.MessageToAssociate.value) {
            if (state.MessageToAssociate.error === '') {
                setState(prevState => ({
                    ...prevState,
                    ['MessageToAssociate']: { value: '', error: 'This field is required' }
                }));
            }

        } else {
            if (state.MessageToAssociate.error !== '') {
                setState(prevState => ({
                    ...prevState,
                    ['MessageToAssociate']: { value: '', error: '' }
                }));

            }
        }
    }, [state]);

    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };

    const useStyles = makeStyles(theme => ({
        link: {
            display: 'flex',
        },
        icon: {
            marginRight: theme.spacing(0.5),
            width: 20,
            height: 20,
        },
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }));
    const classes = useStyles(0);

    return (
        <div>
            {loader ? <div className="loaderWrapper"><CircularProgress /></div> : null}
            <Typography variant="h5" component="h5">
                {strings.HrClearance}
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                    <HomeIcon className={classes.icon} /> {strings.Home}
                </Link>
                <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HrDashboard, "")}>
                    {strings.Dashboard}
                </Link>
                <Typography color="textPrimary">{strings.ClearanceForm}</Typography>
            </Breadcrumbs>
            {showMsg && <div className={classes.root}>
                <Alert severity="warning" className="marginTop16">This resignation is withdrawn - No Action Required!</Alert>
            </div>}
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
                            <td>Resignation email & acceptance<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.Resignationemailacceptance.value} disabled={readOnly} id="Resignationemailacceptance" onBlur={handleOnBlur} onChange={handleOnChange} name="Resignationemailacceptance" autoFocus>
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Resignationemailacceptance.error && <p style={errorStyle}>{state.Resignationemailacceptance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ResignationAcceptancecomments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.ResignationAcceptancecomments.value} />
                                {state.ResignationAcceptancecomments.error && <p style={errorStyle}>{state.ResignationAcceptancecomments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Exit Interview<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.ExitInterview.value} disabled={readOnly} id="ExitInterview" onBlur={handleOnBlur} onChange={handleOnChange} name="ExitInterview"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ExitInterview.error && <p style={errorStyle}>{state.ExitInterview.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ExitInterviewComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.ExitInterviewComments.value} />
                                {state.ExitInterviewComments.error && <p style={errorStyle}>{state.ExitInterviewComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Relocation/Referral Bonus<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.Relocation_x002f_ReferralBonus.value} disabled={readOnly} id="Relocation_x002f_ReferralBonus" onBlur={handleOnBlur} onChange={handleOnChange} name="Relocation_x002f_ReferralBonus"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Relocation_x002f_ReferralBonus.error && <p style={errorStyle}>{state.Relocation_x002f_ReferralBonus.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="Relocation_x002f_ReferralBonusCo" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.Relocation_x002f_ReferralBonusCo.value} />
                                {state.Relocation_x002f_ReferralBonusCo.error && <p style={errorStyle}>{state.Relocation_x002f_ReferralBonusCo.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Sign-on Bonus<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.Sign_x002d_onBonus.value} id="Sign_x002d_onBonus" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="Sign_x002d_onBonus"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Sign_x002d_onBonus.error && <p style={errorStyle}>{state.Sign_x002d_onBonus.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="Sign_x002d_onBonusComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.Sign_x002d_onBonusComments.value} />
                                {state.Sign_x002d_onBonusComments.error && <p style={errorStyle}>{state.Sign_x002d_onBonusComments.error}</p>}
                            </td>
                        </tr>

                        <tr>
                            <td>EL Balance<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.ELBalance.value} id="ELBalance" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="ELBalance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ELBalance.error && <p style={errorStyle}>{state.ELBalance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ELBalanceComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.ELBalanceComments.value} />
                                {state.ELBalanceComments.error && <p style={errorStyle}>{state.ELBalanceComments.error}</p>}
                            </td>
                        </tr>
                        {/* 
                            <tr>
                            <td>Ex-Gratia</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Ex_x002d_Gratia.value} id="Ex_x002d_Gratia" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="Ex_x002d_Gratia"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Ex_x002d_Gratia.error && <p style={errorStyle}>{state.Ex_x002d_Gratia.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="Ex_x002d_GratiaComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.Ex_x002d_GratiaComments.value} />
                                {state.Ex_x002d_GratiaComments.error && <p style={errorStyle}>{state.Ex_x002d_GratiaComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Leave Encashment</td>
                            <td>
                                <FormControl>
                                    <Select value={state.LeaveEncashment.value} disabled={readOnly} id="LeaveEncashment" onBlur={handleOnBlur} onChange={handleOnChange} name="LeaveEncashment"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.LeaveEncashment.error && <p style={errorStyle}>{state.LeaveEncashment.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="LeaveEncashmentComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.LeaveEncashmentComments.value} />
                                {state.LeaveEncashmentComments.error && <p style={errorStyle}>{state.LeaveEncashmentComments.error}</p>}
                            </td>
                        </tr> 
                        <tr>
                            <td>Shift Allowance</td>
                            <td>
                                <FormControl>
                                    <Select value={state.ShiftAllowance.value} disabled={readOnly} id="ShiftAllowance" onBlur={handleOnBlur} onChange={handleOnChange} name="ShiftAllowance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ShiftAllowance.error && <p style={errorStyle}>{state.ShiftAllowance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ShiftAllowanceComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.ShiftAllowanceComments.value} />
                                {state.ShiftAllowanceComments.error && <p style={errorStyle}>{state.ShiftAllowanceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Telephone Allowance</td>
                            <td>
                                <FormControl>
                                    <Select value={state.TelephoneAllowance.value} disabled={readOnly} id="TelephoneAllowance" onBlur={handleOnBlur} onChange={handleOnChange} name="TelephoneAllowance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TelephoneAllowance.error && <p style={errorStyle}>{state.TelephoneAllowance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TelephoneAllowanceComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.TelephoneAllowanceComments.value} />
                                {state.TelephoneAllowanceComments.error && <p style={errorStyle}>{state.TelephoneAllowanceComments.error}</p>}
                            </td>
                        </tr>
                            <tr>
                            <td>Service Letter</td>
                            <td>
                                <FormControl>
                                    <Select value={state.ServiceLetter.value} id="ServiceLetter" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="ServiceLetter"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.ServiceLetter.error && <p style={errorStyle}>{state.ServiceLetter.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="ServiceLetterComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.ServiceLetterComments.value} />
                                {state.ServiceLetterComments.error && <p style={errorStyle}>{state.ServiceLetterComments.error}</p>}
                            </td>
                        </tr>
                         <tr>
                            <td>Deductions</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Deductions.value} id="Deductions" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="Deductions"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Deductions.error && <p style={errorStyle}>{state.Deductions.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="DeductionsComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.DeductionsComments.value} />
                                {state.DeductionsComments.error && <p style={errorStyle}>{state.DeductionsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Insurance Deletion</td>
                            <td>
                                <FormControl>
                                    <Select value={state.Insurance.value} id="Insurance" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="Insurance"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Insurance.error && <p style={errorStyle}>{state.Insurance.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="InsuranceComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.InsuranceComments.value} />
                                {state.InsuranceComments.error && <p style={errorStyle}>{state.InsuranceComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>PF/ESI</td>
                            <td>
                                <FormControl>
                                    <Select value={state.PF_x002f_ESI.value} id="PF_x002f_ESI" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="PF_x002f_ESI"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.PF_x002f_ESI.error && <p style={errorStyle}>{state.PF_x002f_ESI.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="PF_x002f_ESIComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.PF_x002f_ESIComments.value} />
                                {state.PF_x002f_ESIComments.error && <p style={errorStyle}>{state.PF_x002f_ESIComments.error}</p>}
                            </td>
                        </tr>
                        */}
                        <tr>
                            <td>Terminate On Hr Systems<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.TerminateOnHRSystems.value} disabled={readOnly} id="TerminateOnHRSystems" onBlur={handleOnBlur} onChange={handleOnChange} name="TerminateOnHRSystems"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.TerminateOnHRSystems.error && <p style={errorStyle}>{state.TerminateOnHRSystems.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="TerminateOnHRSystemsComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.TerminateOnHRSystemsComments.value} />
                                {state.TerminateOnHRSystemsComments.error && <p style={errorStyle}>{state.TerminateOnHRSystemsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Shortfall of Notice (Waiver if any)<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.Waiver.value} disabled={readOnly} id="Waiver" onBlur={handleOnBlur} onChange={handleOnChange} name="Waiver"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Waiver.error && <p style={errorStyle}>{state.Waiver.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="WaiverComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.WaiverComments.value} />
                                {state.WaiverComments.error && <p style={errorStyle}>{state.WaiverComments.error}</p>}
                            </td>
                        </tr>

                        <tr>
                            <td>Gratuity<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.Gratuity.value} id="Gratuity" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="Gratuity"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Gratuity.error && <p style={errorStyle}>{state.Gratuity.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="GratuityComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.GratuityComments.value} />
                                {state.GratuityComments.error && <p style={errorStyle}>{state.GratuityComments.error}</p>}
                            </td>
                        </tr>

                        <tr>
                            <td>Others (Specify)<span>*</span></td>
                            <td>
                                <FormControl>
                                    <Select value={state.Others.value} id="Others" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} name="Others"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.Others.error && <p style={errorStyle}>{state.Others.error}</p>}
                                </FormControl>
                            </td>
                            <td>
                                <TextField margin="normal" name="OthersComments" disabled={readOnly} onBlur={handleOnBlur} onChange={handleOnChange} value={state.OthersComments.value} />
                                {state.OthersComments.error && <p style={errorStyle}>{state.OthersComments.error}</p>}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="noBoxShadow ">
                    <RadioGroup aria-label="DuesPending" name="DuesPending" value={state.DuesPending.value} onChange={handleOnChange} onBlur={handleOnChange}>
                        <FormControlLabel value="NotifyAssociate" control={<Radio disabled={readOnly} />} label="Message to Associate" />


                        {state.DuesPending.value === 'NotifyAssociate' ?
                            <div>
                                <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Message To Associate" name="MessageToAssociate" disabled={readOnly} placeholder="Enter message here..." multiline margin="normal" variant="outlined" onChange={handleOnChange} onBlur={handleOnChange} value={state.MessageToAssociate.value} />
                                {state.MessageToAssociate.error && <p style={errorStyle}>{state.MessageToAssociate.error}</p>}
                            </div>
                            : ''}
                        <FormControlLabel value="GrantClearance" control={<Radio disabled={readOnly} />} label="Grant Clearance" />

                        {state.DuesPending.value === 'GrantClearance' ?
                            <div>
                                <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Additional Information" name="AdditionalInformation" disabled={readOnly} placeholder="Any additional information" multiline margin="normal" variant="outlined" value={state.AdditionalInformation.value} onChange={handleOnChange} onBlur={handleOnChange}
                                />

                            </div>
                            : ''}
                    </RadioGroup>
                </div>
                {buttonVisibility ? <div>
                    {!disable || state.DuesPending.value === 'NotifyAssociate' ?
                        (
                            state.DuesPending.value === 'NotifyAssociate' ?
                                <Button type="submit" className="marginTop16" variant="contained" color="primary" onClick={saveForm} disabled={readOnly}>Submit</Button> :
                                <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={readOnly}>Submit</Button>
                        )
                        :
                        <div className="inlineBlock">
                            <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm} disabled={readOnly}>Save</Button>
                        </div>}
                </div> : null}
            </form>
        </div>
    );
};

export default HrClearance;