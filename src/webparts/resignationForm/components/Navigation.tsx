import * as React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ItClearance from './IT/ITClearanceForm';
import ResignationDashboard from './Resignations/ResignationDashboard';
import ManagerApprovalForm from './Manager/ManagerApprovalForm';
import OperationsAdminClearance from './OperationsAdmin/OperationsAdminClearanceForm';
import FinanceClearance from './Finance/FinanceClearanceForm'
import SalesForceClearance from './SalesForce/SalesForceClearanceForm';
import HrClearance from './HR/HrClearanceForm';
import ITClearanceDashboard from './IT/ITClearanceDashboard';
import OperationsAdminDashboard from './OperationsAdmin/OperationsAdminDashboard';
import { sp } from '@pnp/sp';

const NavigationItem = (props) => {
    let ID : any;
    let context = props.context;
    sp.web.currentUser.get().then((response) => {
        ID = response.Id;
    });
    return (
        <HashRouter>
            <Switch>
                <Route path="/itClearance/" render={(props) => <ItClearance {...props} ID={ID} />} />
                <Route path="/managerApproval" render={(props) => <ManagerApprovalForm {...props} ID={ID} />}  />
                <Route path="/operationsAdminDashboard" render={(props) => <OperationsAdminDashboard {...props} ID={ID} />}  />
                <Route path="/operationsClearance" render={(props) => <OperationsAdminClearance {...props} ID={ID} />}  />
                <Route path="/financeClearance" render={(props) => <FinanceClearance {...props} ID={ID} />}  />
                <Route path="/salesForceClearance" render={(props) => <SalesForceClearance {...props} ID={ID} />} />
                <Route path="/hrClearance" render={(props) => <HrClearance {...props} ID={ID} />} />
                <Route path="/" exact render={(props) => <ResignationDashboard {...props} context={context} />} />
                <Route path="/itClearanceDashboard" exact render={(props) => <ITClearanceDashboard {...props} />} />
                <Route render={() => <h1>Page Not found</h1>} />

            </Switch>
        </HashRouter>
    );
};


export default NavigationItem;