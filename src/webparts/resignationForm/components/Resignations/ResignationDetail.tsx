import * as React from 'react';
import { useEffect, useState } from 'react';
import { withStyles, Theme, Typography, createStyles, Paper } from '@material-ui/core';
import { sp } from '@pnp/sp';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import '../CommonStyleSheet.scss';

const ResignationDetail = (props) => {
    console.log("props", props);
    let ID = props.props;
    const [employeeDetail, setEmployeeDetail] = useState();
    const [managerClearance, setManagerClearance] = useState();
    const [salesForceClearance, setSalesForceClearance] = useState();
    const [operationsClearance, setOperationsClearance] = useState();
    const [financeClearance, setFinanceClearance] = useState();
    const [hrClearance, setHrClearance] = useState();
    const getEmployeeDetail = () => {
        sp.web.lists.getByTitle("ItClearance").items.select('Id', 'Status', 'EmployeeName', 'EmployeeNameId', 'EmployeeName/Id', 'EmployeeName/EmployeeName', 'EmployeeName/EmployeeCode', 'EmployeeName/Department', 'EmployeeName/JobTitle').expand("EmployeeName").get().then((items) => {
            if (items) {
                console.log("resignation details", items);
                items.forEach(item => {
                    if (ID == item.EmployeeNameId) {
                        console.log('it clerance status', item);
                        setEmployeeDetail(item);
                    }
                });
            }
        });
        sp.web.lists.getByTitle("ManagersClearance").items.select('Id', 'Status', 'EmployeeNameId').get().then((items) => {
            if (items) {
                items.forEach(item => {
                    if (ID == item.EmployeeNameId) {
                        console.log('manager clearance status', item);
                        setManagerClearance(item);
                    }
                });
            }
        });
        sp.web.lists.getByTitle("OperationsClearance").items.select('Id', 'Status', 'EmployeeNameId').get().then((items) => {
            if (items) {
                items.forEach(item => {
                    if (ID == item.EmployeeNameId) {
                        console.log('OPs clearance status', item);
                        setOperationsClearance(item);
                    }
                });
            }
        });
        sp.web.lists.getByTitle("Finance%20Clearance").items.select('Id', 'Status', 'EmployeeNameId').get().then((items) => {
            if (items) {
                items.forEach(item => {
                    if (ID == item.EmployeeNameId) {
                        console.log('Finance clearance status', item);
                        setFinanceClearance(item);
                    }
                });
            }
        });
        sp.web.lists.getByTitle("SalesForceClearance").items.select('Id', 'Status', 'EmployeeNameId').get().then((items) => {
            if (items) {
                console.log('SF clearance status', items);
                items.forEach(item => {
                    if (ID == item.EmployeeNameId) {
                        console.log('SF clearance status', item);
                        setSalesForceClearance(item);
                    }
                });
            }
        });
        sp.web.lists.getByTitle("HrClearance").items.select('Id', 'Status', 'EmployeeNameId').get().then((items) => {
            if (items) {
                console.log('SF clearance status', items);
                items.forEach(item => {
                    if (ID == item.EmployeeNameId) {
                        console.log('HR clearance status', item);
                        setHrClearance(item);
                    }
                });
            }
        });
    }
    useEffect(() => {
        getEmployeeDetail();
    }, []);

    const handleClick = (url, ID) => {
        event.preventDefault();
        if (ID) {
            window.location.href = "?component=" + url + "&userId=" + ID;
        }
        else {
            window.location.href = "?component=" + url;
        }
        console.info('You clicked a breadcrumb.');
    }
    return (
        <Paper className="root">
            <div className="formView">
                <Typography variant="h5" component="h3">
                    Clearance Details
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <Link color="inherit" onClick={() => handleClick('resignationDashboard', "")}>
                        Dashboard
                    </Link>
                    {/* <Link color="inherit" onClick={handleClick}>
                        Core
                    </Link> */}
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
                                <td>{employeeDetail.EmployeeName.EmployeeCode}</td>
                            </tr>
                            <tr>
                                <th>Employee Name</th>
                                <td>{employeeDetail.EmployeeName.EmployeeName}</td>
                            </tr>
                            <tr>
                                <th>Department</th>
                                <td>{employeeDetail.EmployeeName.Department}</td>
                            </tr>
                            <tr>
                                <th>Title</th>
                                <td>{employeeDetail.EmployeeName.JobTitle}</td>
                            </tr>
                            <tr>
                                <th colSpan={2}><h3>Clearance Status</h3></th>
                            </tr>
                            <tr>
                                <td>Manager Clearance</td>
                                <td>
                                    {managerClearance && managerClearance.Status != "Approved" ?
                                        <Link onClick={() => handleClick('managerClearance', managerClearance.ID)}>{managerClearance.Status}</Link> : "Approved"}
                                </td>
                            </tr>
                            <tr>
                                <td>IT Clearance</td>
                                <td>
                                    {employeeDetail && employeeDetail.Status != "Approved" ?
                                        <Link onClick={() => handleClick('itClearance', employeeDetail.ID)}>{employeeDetail.Status}</Link> : "Approved"}
                                </td>
                            </tr>
                            <tr>
                                <td>SalesForce Clearance</td>
                                <td>
                                    {salesForceClearance && salesForceClearance.Status != "Approved" ?
                                        <Link onClick={() => handleClick('salesForceClearance', salesForceClearance.ID)}>{salesForceClearance.Status}</Link> : "Approved"}
                                </td>
                            </tr>
                            <tr>
                                <td>Finance Clearance</td>
                                <td>
                                    {financeClearance && financeClearance.Status != "Approved" ?
                                        <Link onClick={() => handleClick('financeClearance', financeClearance.ID)}>{financeClearance.Status}</Link> : "Approved"}
                                </td>
                            </tr>
                            <tr>
                                <td>Operations/Admin Clearance</td>
                                <td>
                                    {operationsClearance && operationsClearance.Status != "Approved" ?
                                        <Link onClick={() => handleClick('operationsClearance', operationsClearance.ID)}>{operationsClearance.Status}</Link> : "Approved"}
                                </td>
                            </tr>
                            <tr>
                                <td>HR Clearance</td>
                                <td>
                                    {hrClearance && hrClearance.Status != "Approved" ?
                                        <Link onClick={() => handleClick('hrClearance', hrClearance.ID)}>{hrClearance.Status}</Link> : "Approved"}

                                </td>
                            </tr>
                        </tbody>
                    </table> : null}
                </div>
            </div>
        </Paper>
    );
};

export default ResignationDetail;