import * as React from 'react';
import { useEffect } from 'react';
import ItClearance from './IT/ITClearanceForm';
import ResignationDashboard from './Resignations/ResignationDashboard';
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
import ClearanceDashboard from './ClearanceDashboard';
import { sp } from '@pnp/sp';
import ResignationForm from './Resignations/ResignationForm';
import ResignationList from './Resignations/ResignationList';

const NavigationItem = (props) => {
    let ID: any;
    let context = props.context;
    var employeeData: any = [];
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
    let data: any = [];

    sp.web.currentUser.get().then((response) => {
        // console.log("navigation", response);
        data = response;
    });



    const renderChilds = () => {
        switch (paramvalues['component']) {
            case "itClearance":
                return <ItClearance props={paramvalues['Id']} />;
            case "itClearanceDashboard":
                return <ITClearanceDashboard props={paramvalues['Id']} />;
            case "managerClearance":
                return <ManagerClearance props={paramvalues['Id']} />;
            case "managerClearanceDashboard":
                return <ManagerClearanceDashboard props={paramvalues['Id']} />;
            case "operationsAdminDashboard":
                return <OperationsAdminDashboard props={paramvalues['Id']} />;
            case "operationsClearance":
                return <OperationsAdminClearance props={paramvalues['Id']} />;
            case "financeClearance":
                return <FinanceClearance props={paramvalues['Id']} />;
            case "salesForceClearance":
                return <SalesForceClearance props={paramvalues['Id']} />;
            case "salesForceDashboard":
                return <SalesForceDashboard />;
            case "hrClearance":
                return <HrClearance props={paramvalues['Id']} />;
            case "resignationDashboard":
                return <ResignationList />;
            case "resignationForm":
                return <ResignationForm context={context} props={paramvalues['Id']} />;
            case "resignationDetail":
                return <ResignationDetail  props={paramvalues['Id']} />;
            default:
                return <ResignationForm context={context} />;
            // return <h1>No Page Found</h1>;
        }
    };

    return (
        <div>{renderChilds()}</div >
    );
};


export default NavigationItem;