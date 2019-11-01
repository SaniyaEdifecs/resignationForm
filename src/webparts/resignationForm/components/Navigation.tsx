import * as React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ItClearance from './IT/ITClearanceForm';
import ResignationDashboard from './Resignations/ResignationDashboard';
import ManagerApprovalForm from './Manager/ManagerApprovalForm';
import OperationsAdminClearance from './OperationsAdmin/OperationsAdminClearanceForm';
import FinanceClearance from './Finance/FinanceClearanceForm';
import SalesForceClearance from './SalesForce/SalesForceClearanceForm';
import HrClearance from './HR/HrClearanceForm';
import ITClearanceDashboard from './IT/ITClearanceDashboard';
import OperationsAdminDashboard from './OperationsAdmin/OperationsAdminDashboard';
import SalesForceDashboard from './SalesForce/SalesForceDashboard';
import ManagerClearance from './Manager/ManagerClearanceForm';
import ClearanceDashboard from './ClearanceDashboard';
import { sp } from '@pnp/sp';
import ResignationForm from './Resignations/ResignationForm';

const NavigationItem = (props) => {
    let ID: any;
    let context = props.context;

    // sp.web.currentUser.get().then((response) => {
    //     ID = response.Id;
    //     IsSiteAdmin = response.IsSiteAdmin;
    //     console.log("IsSiteAdmin", IsSiteAdmin);
    // });

    // let params = window.location.search;
    let getParams = function (url) {
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
    const renderChilds = () => {
        switch (paramvalues['component']) {
            case "ItClearance":
                return <ItClearance props={paramvalues['Id']} />;
            case "managerApproval":
                return <ManagerApprovalForm />;
            case "managerClearance":
                return <ManagerClearance props={paramvalues['Id']} />;
            case "operationsAdminDashboard":
                return <OperationsAdminDashboard />;
            case "operationsClearance":
                return <OperationsAdminClearance props={paramvalues['Id']} />;
            case "financeClearance":
                return <FinanceClearance props={paramvalues['Id']} />;
            case "salesForceClearance":
                return <SalesForceDashboard />;
            case "hrClearance":
                return <HrClearance props={paramvalues['Id']} />;
            case "itClearanceDashboard":
                return <ITClearanceDashboard />;
            case "ResignationForm":
                return <ResignationForm context={context} props={paramvalues['Id']}/>;
            default:
                return <ResignationForm  context={context} />;

        }
    };

    return (
        <div>{renderChilds()}</div >
    );
};


export default NavigationItem;