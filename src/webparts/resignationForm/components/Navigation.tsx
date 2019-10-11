import * as React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ItClearance from './IT/ITClearanceForm';
import ResignationDashboard from './Resignations/ResignationDashboard';
import ManagerApprovalForm from './Manager/ManagerApprovalForm';
import OperationsAdminClearance from './OperationsAdmin/OperationsAdminClearanceForm';
import FinanceClearance from './Finance/FinanceClearanceForm'
import SalesForceClearance from './SalesForce/SalesForceClearanceForm';
import HrClearance from './HR/HrClearanceForm';

const NavigationItem = (props) => {

    let context = props.context;
    console.log("navigations", context);
    return (
        <HashRouter>
            <Switch>
                <Route path="/itClearance" component={ItClearance} />
                <Route path="/managerApproval" component={ManagerApprovalForm} />
                <Route path="/operationsClearance" component={OperationsAdminClearance} />
                <Route path="/financeClearance" component={FinanceClearance} />
                <Route path="/salesForceClearance" component={SalesForceClearance} />
                <Route path="/hrClearance" component={HrClearance} />
                <Route path="/" exact render={(props) => <ResignationDashboard {...props} context={context} />} />
                <Route render={() => <h1>Page Not found</h1>} />

            </Switch>
        </HashRouter>
    );
};


export default NavigationItem;