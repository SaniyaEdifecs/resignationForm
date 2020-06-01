import * as React from 'react';
import { useEffect, useState } from 'react';
import { Paper, makeStyles, CircularProgress } from '@material-ui/core';
import { Typography, TextField, Button } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import resignationUseForm from './ResignationUseForm';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';
import Moment from 'react-moment';
import SharePointService from '../SharePointServices';
import * as strings from 'ResignationFormWebPartStrings';
import '../CommonStyleSheet.scss';

const ResignationDetail = ({ props }) => {
    let ID = props;
    const [readOnly, setReadOnly] = useState(false);
    const [loader, showLoader] = useState(false);
    const [employeeDetail, setEmployeeDetail] = useState({});
    const [itDetail, setItDetail] = useState({});
    const [managerClearance, setManagerClearance] = useState({});
    const [salesForceClearance, setSalesForceClearance] = useState({});
    const [operationsClearance, setOperationsClearance] = useState({});
    const [financeClearance, setFinanceClearance] = useState({});
    const [hrClearance, setHrClearance] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const formFields = ["FinalComments"];
    var stateSchema = {};
    var validationStateSchema = {};
    formFields.forEach(formField => {
        stateSchema[formField] = {};
        validationStateSchema[formField] = {};
        stateSchema[formField].value = "";
        stateSchema[formField].error = "";
        validationStateSchema[formField].required = true;
    });


    const onSubmitForm = (value) => {
        showLoader(true);
        let payload = {};
        for (const key in value) {
            payload[key] = value[key].value;
        }

        payload = { ...payload, 'Status': status };
        console.log("paylod", payload);
        SharePointService.getListByTitle("ResignationList").items.getById(ID).update(payload).then(items => {
            showLoader(false);
            getEmployeeDetail();
        });

    };
    const { state, disable, status, handleOnChange, handleOnSubmit } = resignationUseForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );


    const getEmployeeDetail = () => {
        SharePointService.getListByTitle('ResignationList').items.getById(ID).get().then((response: any) => {

            if (response) {
                setEmployeeDetail(response);
            }
            if (response['Status'] === "Approved") {

                setReadOnly(true);
            }
        }, (error) => {
            setErrorMsg("No Access");
        });
        SharePointService.getListByTitle("ItClearance").items.filter('EmployeeNameId eq ' + ID).get().then((items) => {
            if (items) {
                setItDetail(items[0]);
                // console.log("itclearance details", items[0]);
            }
        }, (error) => {
            setErrorMsg("No Access");
        });
        SharePointService.getListByTitle("ManagersClearance").items.filter('EmployeeNameId eq ' + ID).get().then((items) => {
            if (items) {
                setManagerClearance(items[0]);
            }
        }, (error) => {
            setErrorMsg("No Access");
        });
        SharePointService.getListByTitle("OperationsClearance").items.filter('EmployeeNameId eq ' + ID).get().then((items) => {
            if (items) {
                setOperationsClearance(items[0]);
            }
        }, (error) => {
            setErrorMsg("No Access");
        });
        SharePointService.getListByTitle("Finance%20Clearance").items.filter('EmployeeNameId eq ' + ID).get().then((items) => {
            if (items) {
                setFinanceClearance(items[0]);
            }
        }, (error) => {
            setErrorMsg("No Access");
        });
        SharePointService.getListByTitle("SalesForceClearance").items.filter('EmployeeNameId eq ' + ID).get().then((items) => {
            if (items) {
                setSalesForceClearance(items[0]);
            }
        }, (error) => {
            setErrorMsg("No Access");
        });
        SharePointService.getListByTitle("HrClearance").items.filter('EmployeeNameId eq ' + ID).get().then((items) => {
            if (items) {
                setHrClearance(items[0]);
            }
        }, (error) => {
            setErrorMsg("No Access");
        });
    };
    useEffect(() => {
        getEmployeeDetail();
    }, []);
    useEffect(() => { }, [employeeDetail]);

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
    }));
    const classes = useStyles(0);
    console.log('status', employeeDetail['HrStatus']);
    return (
        <Paper className="root">
            {loader ? <div className="loaderWrapper"><CircularProgress /></div> : null}
            {(employeeDetail['HrStatus'] === "Approved") && (employeeDetail['FinanceStatus'] === "Approved") && (employeeDetail['ItStatus'] === "Approved") && (employeeDetail['ManagerStatus'] === "Approved") && (employeeDetail['emplStatus'] === "Approved") && (employeeDetail['Operations_x002f_AdminStatus'] === "Approved") && (employeeDetail['SalesforceStatus'] === "Approved") ?

                <div className="formView clearanceReviewForm">
                    <Typography variant="h5" component="h3">
                        Clearance Review
                    </Typography>
                    <div className="clearanceTable">
                        <table cellPadding="0" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <th>Employee Code</th>
                                    <td>{employeeDetail['EmployeeCode']}</td>
                                    <th>Resignation Date</th>
                                    <td><Moment format="DD/MM/YYYY">{employeeDetail['ResignationDate']}</Moment></td>
                                </tr>
                                <tr>
                                    <th>Employee Name</th>
                                    <td>{employeeDetail['EmployeeName']}</td>
                                    <th>Last Working Date</th>
                                    <td> <Moment format="DD/MM/YYYY">{employeeDetail['LastWorkingDate']}</Moment></td>
                                </tr>
                                <tr>
                                    <th>Department/BU</th>
                                    <td>{employeeDetail['Department']}</td>
                                    <th>Personal Email</th>
                                    <td>{employeeDetail['PersonalEmail']}</td>
                                </tr>
                                <tr>
                                    <th>Location</th>
                                    <td>{employeeDetail['Location']}</td>
                                    <th>Personal Phone</th>
                                    <td>{employeeDetail['PersonalPhone']}</td>
                                </tr>
                                <tr className="backgroundColor">
                                    <th>Clearance by</th>
                                    <th>ITEM</th>
                                    <th>YES/NO/NA</th>
                                    <th>COMMENTS</th>
                                </tr>
                                <tr>
                                    <th align="center">Manager</th>
                                    <td colSpan={3} className="innerTable">
                                        <table cellPadding="0" cellSpacing="0" >
                                            <tbody>
                                                <tr>
                                                    <td>Handover complete</td>
                                                    <td>{managerClearance && managerClearance['HandoverComplete']} </td>
                                                    <td>{managerClearance['HandoverCompleteComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>Data Backup</td>
                                                    <td>{managerClearance['DataBackup']} </td>
                                                    <td>{managerClearance['DataBackupComments']}</td>

                                                </tr>
                                                <tr>
                                                    <td>Email Backup</td>
                                                    <td>{managerClearance['EmailBackup']}</td>
                                                    <td>{managerClearance['EmailBackupComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>Notice Waiver (No. of days)</td>
                                                    <td>{managerClearance['NoticeWaiver']}</td>
                                                    <td>{managerClearance['NoticeWaiverComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>Access removal (All applications)</td>
                                                    <td> {managerClearance['AccessRemoval']}</td>
                                                    <td>{managerClearance['AccessRemovalComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Email re-routing</td>
                                                    <td>{managerClearance['EmailRe_x002d_routing']} </td>
                                                    <td>{managerClearance['EmailRe_x002d_routingComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Others(Specify)</td>
                                                    <td>{managerClearance['Others_x0028_specify_x0029_']} </td>
                                                    <td>{managerClearance['OtherComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Additional Comments</td>
                                                    <td colSpan={2}>{managerClearance['AdditionalInformation']}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <th>IT</th>
                                    <td colSpan={3} className="innerTable">
                                        <table cellPadding="0" cellSpacing="0" >
                                            <tbody>
                                                <tr>
                                                    <td>Mailbox and important data back-up</td>
                                                    <td>{itDetail['DataBackup']}</td>
                                                    <td>{itDetail['DataBackupComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>Access Removal (Email, User Account, All applications)</td>
                                                    <td>{itDetail['AccessRemoval']}</td>
                                                    <td>{itDetail['AccessRemovalComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={3}> <b>Hardware</b></td>
                                                </tr>
                                                <tr>
                                                    <td>Laptop/Destop/Dock Station</td>
                                                    <td>{itDetail && itDetail['Laptop_x002f_Desktop']} </td>
                                                    <td>{itDetail['DesktopComments']}</td>
                                                </tr>

                                                <tr>
                                                    <td>Others - Charger, Mouse, Headphones etc.</td>
                                                    <td>{itDetail['PeripheralDevices']} </td>
                                                    <td>{itDetail['PeripheralDevicesComments0']}</td>

                                                </tr>
                                                <tr>
                                                    <td colSpan={3}><b>Assigned cards</b></td>
                                                </tr>
                                                <tr>
                                                    <td>Access Card</td>
                                                    <td>{itDetail['AccessCard']}</td>
                                                    <td>{itDetail['AccessCardComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>ID Card</td>
                                                    <td>{itDetail['IDCard']}</td>
                                                    <td>{itDetail['IDCardComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phone & SIM/Data Card</td>
                                                    <td>{itDetail['DataCard']}</td>
                                                    <td>{itDetail['DataCardComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Additional Comments</td>
                                                    <td colSpan={2}>{itDetail['AdditionalInformation']}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <th>SalesForce</th>
                                    <td colSpan={3} className="innerTable">
                                        <table cellPadding="0" cellSpacing="0" >
                                            <tbody>
                                                <tr>
                                                    <td>SDFC License termination:
                                                    email to Katie.loescher@edifecs.com
                                                    </td>
                                                    <td>{salesForceClearance && salesForceClearance['LicenseTermination']} </td>
                                                    <td>{salesForceClearance['LicenseTerminationComment']}</td>
                                                </tr>
                                                <tr> <td>Additional Comments</td>
                                                    <td colSpan={2}>{salesForceClearance['AdditionalInformation']}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Operations/Admins</th>
                                    <td colSpan={3} className="innerTable">
                                        <table cellPadding="0" cellSpacing="0" >
                                            <tbody>
                                                <tr>
                                                    <td>Pedestal Keys</td>
                                                    <td>{operationsClearance && operationsClearance['PedestalKeys']} </td>
                                                    <td>{operationsClearance['PedestalKeysComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>Car/Bike Stickers</td>
                                                    <td>{operationsClearance['Stickers']}</td>
                                                    <td>{operationsClearance['StickerComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Stationary Clearance</td>
                                                    <td>{operationsClearance['StationaryClearance']}</td>
                                                    <td>{operationsClearance['StationaryClearanceComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>SIM Card/ Dongle/Mobile</td>
                                                    <td>{operationsClearance['SimCard']}</td>
                                                    <td>{operationsClearance['SimCardComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Visiting Cards</td>
                                                    <td>{operationsClearance['VisitingCards']}</td>
                                                    <td>{operationsClearance['VisitingCardsComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Travel Portal Access</td>
                                                    <td>{operationsClearance['KuoniConcurAccess']}</td>
                                                    <td>{operationsClearance['KuoniConcurAccessComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Biometric Access</td>
                                                    <td>{operationsClearance['BiometricAccess']}</td>
                                                    <td>{operationsClearance['BiometricAccessComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Others (Specify)</td>
                                                    <td>{operationsClearance['Others']}</td>
                                                    <td>{operationsClearance['OthersComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Additional Comments</td>
                                                    <td colSpan={2}>{operationsClearance['AdditionalInformation']}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Finance</th>
                                    <td colSpan={3} className="innerTable">
                                        <table cellPadding="0" cellSpacing="0" >
                                            <tbody>
                                                <tr>
                                                    <td>Loan/Imprest balance</td>
                                                    <td>{financeClearance && financeClearance['Loan_x002f_ImprestBalance']} </td>
                                                    <td>{financeClearance['Loan_x002f_ImprestBalanceComment']}</td>
                                                </tr>
                                                <tr>
                                                    <td>Travel Advance/Expenses</td>
                                                    <td>{financeClearance['TravelAdvance_x002f_Expenses']}</td>
                                                    <td>{financeClearance['TravelAdvance_x002f_ExpensesComm']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Telephone reimbursement</td>
                                                    <td>{financeClearance['TelephoneReimbursement']}</td>
                                                    <td>{financeClearance['TelephoneReimbursementComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td >Investment proofs as required for Income Tax</td>
                                                    <td>{financeClearance['InvestmentProofs']}</td>
                                                    <td>{financeClearance['InvestmentProofsComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>1. House Rent Receipts</td>
                                                    <td>{financeClearance['HouseRentReceipts']}</td>
                                                    <td>{financeClearance['HouseRentReceiptsComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>2. Investment u/s 80C</td>
                                                    <td>{financeClearance['Investment80C']}</td>
                                                    <td>{financeClearance['Investment80cComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>3. Housing loan</td>
                                                    <td>{financeClearance['HousingLoan']}</td>
                                                    <td>{financeClearance['HousingLoanComments']} </td>
                                                </tr>
                                                <tr><td>Additional Comments</td>
                                                    <td colSpan={2}>{financeClearance['AdditionalInformation']}</td> </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <th>HR</th>
                                    <td colSpan={3} className="innerTable">
                                        <table cellPadding="0" cellSpacing="0" >
                                            <tbody>
                                                <tr>
                                                    <td>Resignation email & acceptance</td>
                                                    <td>{hrClearance && hrClearance['Resignationemailacceptance']} </td>
                                                    <td>{hrClearance['ResignationAcceptancecomments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>Exit Interview Form</td>
                                                    <td>{hrClearance['ExitInterview']}</td>
                                                    <td>{hrClearance['ExitInterviewComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Relocation/Referral Bonus</td>
                                                    <td>{hrClearance['Relocation_x002f_ReferralBonus']}</td>
                                                    <td>{hrClearance['Relocation_x002f_ReferralBonusCo']} </td>
                                                </tr>
                                                <tr>
                                                    <td >Sign-on bonus</td>
                                                    <td>{hrClearance['Sign_x002d_onBonus']}</td>
                                                    <td>{hrClearance['Sign_x002d_onBonusComments']}</td>
                                                </tr>
                                                <tr>
                                                    <td>EL Balance</td>
                                                    <td>{hrClearance['ELBalance']}</td>
                                                    <td>{hrClearance['ELBalanceComments']} </td>
                                                </tr>
                                                {/* <tr>
                                                    <td>Shift Allowance</td>
                                                    <td>{hrClearance['ShiftAllowance']}</td>
                                                    <td>{hrClearance['ShiftAllowanceComments']} </td>
                                                </tr> */}
                                                <tr>
                                                    <td>Terminate on Hr systems - ADP, Bamboo,
                                                        <br /> Org.Wizard, Jobvite, Savior
                                                    </td>
                                                    <td>{hrClearance['TerminateOnHRSystems']}</td>
                                                    <td>{hrClearance['TerminateOnHRSystemsComments']} </td>
                                                </tr>
                                                {/* <tr>
                                                    <td>Shortfall of Notice (Waiver if any)</td>
                                                    <td>{hrClearance['ShiftAllowance']}</td>
                                                    <td>{hrClearance['ShiftAllowanceComments']} </td>
                                                </tr> */}
                                                <tr>
                                                    <td colSpan={3}>Payroll, Compliance & Benefits:</td>
                                                </tr>
                                                <tr>
                                                    <td>Gratuity</td>
                                                    <td>{hrClearance['Gratuity']}</td>
                                                    <td>{hrClearance['GratuityComments']} </td>
                                                </tr>
                                                {/*   <tr>
                                                    <td>Insurance Deductions</td>
                                                    <td>{hrClearance['Insurance']}</td>
                                                    <td>{hrClearance['InsuranceComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>PF/ESI</td>
                                                    <td>{hrClearance['PF_x002f_ESI']}</td>
                                                    <td>{hrClearance['PF_x002f_ESIComments']} </td>
                                                </tr> */}
                                                <tr>
                                                    <td>Others (Specify)</td>
                                                    <td>{hrClearance['Others']}</td>
                                                    <td>{hrClearance['OthersComments']} </td>
                                                </tr>
                                                <tr>
                                                    <td>Additional Comments</td>
                                                    <td colSpan={2}>{financeClearance['AdditionalInformation']}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4}> </td>
                                </tr>
                            </tbody>
                        </table>
                        {readOnly ? <div>
                            <strong>Final Comments: </strong>
                            <span> {employeeDetail['FinalComments']}</span>
                        </div> :
                            <form onSubmit={handleOnSubmit} className="clearanceForm marginTop16">
                                <div>
                                    <TextField id="outlined-textarea" required className="width50 MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal" label="Final Comments" name="FinalComments" placeholder="Enter message here..." multiline margin="normal" variant="outlined" onChange={handleOnChange} value={state.FinalComments.value} />
                                    {state.FinalComments.error && <p style={errorStyle}>{state.FinalComments.error}</p>}
                                </div>
                                <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Submit</Button>
                            </form>}
                    </div>
                </div> : <div className="formView">
                    <Typography variant="h5" component="h3">
                        Clearance Details
                     </Typography>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                            <HomeIcon className={classes.icon} /> {strings.Home}
                        </Link>
                        <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.ResigntionDashboard, "")}>
                            Clearance Dashboard
                        </Link>
                        <Typography color="textPrimary">Clearance Details</Typography>
                    </Breadcrumbs>
                    <div className="clearanceTable">
                        {employeeDetail ? <table cellPadding="0" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <th colSpan={2}><h3>Employee Details</h3></th>
                                </tr>
                                <tr>
                                    <th>Employee Code</th>
                                    <td>{employeeDetail['EmployeeCode']}</td>
                                </tr>
                                <tr>
                                    <th>Employee Name</th>
                                    <td>{employeeDetail['EmployeeName']}</td>
                                </tr>
                                <tr>
                                    <th>Department</th>
                                    <td>{employeeDetail['Department']}</td>
                                </tr>
                                <tr>
                                    <th>Title</th>
                                    <td>{employeeDetail['JobTitle']}</td>
                                </tr>
                                <tr>
                                    <th>Last Working Date</th>
                                    <td><Moment format="DD/MM/YYYY">{employeeDetail['LastWorkingDate']}</Moment></td>
                                </tr>
                                <tr>
                                    <th colSpan={2}><h3>Clearance Status</h3></th>
                                </tr>
                                <tr>
                                    <td>Manager Clearance</td>
                                    {managerClearance ? <td>
                                        {managerClearance && managerClearance['Status'] != "Approved" ?
                                            <Link onClick={() => SharePointService.redirectTo('managerClearance', managerClearance['ID'])}>{managerClearance['Status']}</Link> : "Approved"}
                                    </td> : <td>No Access</td>}
                                </tr>
                                <tr>
                                    <td>IT Clearance</td>
                                    {itDetail ? <td>
                                        {itDetail && itDetail['Status'] != "Approved" ?
                                            <Link onClick={() => SharePointService.redirectTo('itClearance', itDetail['ID'])}>{itDetail['Status']}</Link> : "Approved"}
                                    </td> : <td>No Access</td>}
                                </tr>
                                <tr>
                                    <td>SalesForce Clearance</td>
                                    {salesForceClearance ? <td>
                                        {salesForceClearance && salesForceClearance['Status'] != "Approved" ?
                                            <Link onClick={() => SharePointService.redirectTo('salesForceClearance', salesForceClearance['ID'])}>{salesForceClearance['Status']}</Link> : "Approved"}
                                    </td> : <td>No Access</td>}
                                </tr>
                                <tr>
                                    <td>Finance Clearance</td>
                                    {financeClearance ? <td>
                                        {financeClearance && financeClearance['Status'] != "Approved" ?
                                            <Link onClick={() => SharePointService.redirectTo('financeClearance', financeClearance['ID'])}>{financeClearance['Status']}</Link> : "Approved"}
                                    </td> : <td>No Access</td>}
                                </tr>
                                <tr>
                                    <td>Operations/Admin Clearance</td>
                                    {operationsClearance ? <td>
                                        {operationsClearance && operationsClearance['Status'] != "Approved" ?
                                            <Link onClick={() => SharePointService.redirectTo('operationsClearance', operationsClearance['ID'])}>{operationsClearance['Status']}</Link> : "Approved"}
                                    </td> : <td>No Access</td>}
                                </tr>
                                <tr>
                                    <td>HR Clearance</td>
                                    {hrClearance ? <td>
                                        {hrClearance && hrClearance['Status'] != "Approved" ?
                                            <Link onClick={() => SharePointService.redirectTo('hrClearance', hrClearance['ID'])}>{hrClearance['Status']}</Link> : "Approved"}
                                    </td> : <td>No Access</td>}
                                </tr>
                            </tbody>
                        </table> : null}
                    </div>
                </div>
            }
        </Paper>
    );
};

export default ResignationDetail;