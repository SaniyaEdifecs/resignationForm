import * as React from 'react';
import { useEffect } from 'react';
import ItClearance from './IT/ITClearanceForm';
import OperationsAdminClearance from './OperationsAdmin/OperationsAdminClearanceForm';
import FinanceClearance from './Finance/FinanceClearanceForm';
import SalesForceClearance from './SalesForce/SalesForceClearanceForm';
import HrClearance from './HR/HrClearanceForm';
import ITClearanceDashboard from './IT/ITClearanceDashboard';
import OperationsAdminDashboard from './OperationsAdmin/OperationsAdminDashboard';
import SalesForceDashboard from './SalesForce/SalesForceDashboard';
import ManagerClearance from './Manager/ManagerClearanceForm';
import ManagerClearanceDashboard from './Manager/ManagerClearanceDashboard';
import ResignationDetail from './Resignations/ResignationDetail';
import FinanceDashboard from './Finance/FinanceDashboard';
import { sp } from '@pnp/sp';
import ResignationForm from './Resignations/ResignationForm';
import ResignationList from './Resignations/ResignationList';
import HrClearanceDashboard from './HR/HrClearanceDashboard';
import EmployeeDetails from './Employee/EmployeeDetails';
import Dashboard from './Dashboard';
import EmployeeDashboard from './Employee/employeeDashboard';
const NavigationItem = (props) => {
    let ID: any;
    let context = props.context;
    let getParams = (url) => {
        var params = {};
        var parser = document.createElement('a');
        parser.href = url;
        var query = parser.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            params[pair[0]] = decodeURIComponent(pair[1]);
        }
        return params;
    };

    let paramvalues = getParams(window.location.search);
    let currentUser: any;

    sp.web.currentUser.get().then((response) => {
        currentUser = response;
    });

    const renderChilds = () => {
        switch (paramvalues['component']) {
            case "itClearance":
                return <ItClearance props={paramvalues['userId']} currentUser = {currentUser}/>;
            case "itClearanceDashboard":
                return <ITClearanceDashboard props={paramvalues['userId']} />;
            case "managerClearance":
                return <ManagerClearance props={paramvalues['userId']} />;
            case "managerClearanceDashboard":
                return <ManagerClearanceDashboard props={paramvalues['userId']} />;
            case "operationsAdminDashboard":
                return <OperationsAdminDashboard props={paramvalues['userId']} />;
            case "operationsClearance":
                return <OperationsAdminClearance props={paramvalues['userId']} />;
            case "financeClearance":
                return <FinanceClearance props={paramvalues['userId']} />;
            case "financeDashboard":
                return <FinanceDashboard props={paramvalues['userId']} />;
            case "salesForceClearance":
                return <SalesForceClearance props={paramvalues['userId']} />;
            case "salesForceDashboard":
                return <SalesForceDashboard props={paramvalues['userId']} />;
            case "hrClearance":
                return <HrClearance props={paramvalues['userId']} />;
            case "hrClearanceDashboard":
                return <HrClearanceDashboard props={paramvalues['userId']} />;
            case "resignationDashboard":
                return <ResignationList props={props} />;
            case "employeeDetails":
                return <EmployeeDetails props={paramvalues['userId']} context={context} />;
            case "employeeDashboard":
                return <EmployeeDashboard props={paramvalues['userId']} />;
            case "resignationForm":
                return <ResignationForm context={context} props={paramvalues['userId']} />;
            case "resignationDetail":
                return <ResignationDetail props={paramvalues['userId']} />;
            default:
                return <Dashboard context={context} />;
            // return <h1>No Page Found</h1>;
        }
    };

    return (
        <div>{renderChilds()}</div >
    );
};


export default NavigationItem;