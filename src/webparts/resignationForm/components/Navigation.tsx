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

const NavigationItem = (props) => {
    let ID: any;
    let context = props.context;
    let IsSiteAdmin: boolean;
    
    sp.web.currentUser.get().then((response) => {
        ID = response.Id;
        IsSiteAdmin = response.IsSiteAdmin;
        console.log("IsSiteAdmin", IsSiteAdmin);
    });
    return (
        <HashRouter>
            <Switch>
                <Route path="/itClearance/:ID" render={(props) => <ItClearance {...props} ID={ID} />} />
                <Route path="/managerApproval/:ID" render={(props) => <ManagerApprovalForm {...props} ID={ID} />} />
                <Route path="/managerClearance/:ID" render={(props) => <ManagerClearance {...props} ID={ID} />} />
                <Route path="/operationsAdminDashboard" render={(props) => <OperationsAdminDashboard {...props} ID={ID} />} />
                <Route path="/operationsClearance/:ID" render={(props) => <OperationsAdminClearance {...props} ID={ID} />} />
                <Route path="/financeClearance/:ID" render={(props) => <FinanceClearance {...props} ID={ID} />} />
                <Route path="/salesForceClearance/:ID" render={(props) => <SalesForceClearance {...props} ID={ID} />} />
                <Route path="/salesForceDashboard/:ID" render={(props) => <SalesForceDashboard {...props} ID={ID} />} />
                <Route path="/hrClearance/:ID" render={(props) => <HrClearance {...props} ID={ID} />} />
                <Route path="/itClearanceDashboard" exact render={(props) => <ITClearanceDashboard {...props} />} />
                <Route path="/" exact render={(props) => <ResignationDashboard {...props} context={context} IsSiteAdmin={IsSiteAdmin} />} />
                <Route path="/:ID" exact render={(props) => <ResignationDashboard {...props} context={context} IsSiteAdmin={IsSiteAdmin} />} />
                {/* <Route path="/id=:ID" exact render={(props) => <ResignationDashboard {...props} context={context} IsSiteAdmin={IsSiteAdmin} />} /> */}
                <Route path="/clearanceDashboard/:ID" component={ClearanceDashboard}></Route>
                <Route render={() => <h1>Page Not found</h1>} />
            </Switch>
        </HashRouter>
    );
};


export default NavigationItem;