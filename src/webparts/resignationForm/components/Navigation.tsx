import * as React from "react";
import ItClearance from "./IT/ITClearanceForm";
import OperationsAdminClearance from "./OperationsAdmin/OperationsAdminClearanceForm";
import FinanceClearance from "./Finance/FinanceClearanceForm";
import SalesForceClearance from "./SalesForce/SalesForceClearanceForm";
import HrClearance from "./HR/HrClearanceForm";
import ITClearanceDashboard from "./IT/ITClearanceDashboard";
import OperationsAdminDashboard from "./OperationsAdmin/OperationsAdminDashboard";
import SalesForceDashboard from "./SalesForce/SalesForceDashboard";
import ManagerClearance from "./Manager/ManagerClearanceForm";
import ManagerClearanceDashboard from "./Manager/ManagerClearanceDashboard";
import ResignationDetail from "./Resignations/ResignationDetail";
import FinanceDashboard from "./Finance/FinanceDashboard";
import * as strings from "ResignationFormWebPartStrings";
import ResignationForm from "./Resignations/ResignationForm";
import ResignationList from "./Resignations/ResignationList";
import HrClearanceDashboard from "./HR/HrClearanceDashboard";
import EmployeeDetails from "./Employee/EmployeeDetails";
import Dashboard from "./Dashboard";
import EmployeeDashboard from "./Employee/employeeDashboard";

const Navigation = (props) => {
  let ID: any;
  let context = props.context;
  let getParams = (url) => {
    var params = {};
    var query = url.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };

  let paramvalues = getParams(window.location.search);
  let path = window.location.href;

  const renderChilds = () => {
    // switch (paramvalues["component"]) {
    //   case "itClearance":
    //     return (
    //       <ItClearance Id={paramvalues["resignationId"]} context={context} />
    //     );
    //   case "itClearanceDashboard":
    //     return <ITClearanceDashboard />;
    //   case "managerClearance":
    //     return (
    //       <ManagerClearance
    //         Id={paramvalues["resignationId"]}
    //         context={context}
    //       />
    //     );
    //   case "managerClearanceDashboard":
    //     return (
    //       <ManagerClearanceDashboard props={paramvalues["resignationId"]} />
    //     );
    //   case "operationClearanceDashboard":
    //     return (
    //       <OperationsAdminDashboard props={paramvalues["resignationId"]} />
    //     );
    //   case "operationsClearance":
    //     return (
    //       <OperationsAdminClearance
    //         Id={paramvalues["resignationId"]}
    //         context={context}
    //       />
    //     );
    //   case "financeClearance":
    //     return (
    //       <FinanceClearance
    //         Id={paramvalues["resignationId"]}
    //         context={context}
    //       />
    //     );
    //   case "financeClearanceDashboard":
    //     return <FinanceDashboard props={paramvalues["resignationId"]} />;
    //   case "salesForceClearance":
    //     return (
    //       <SalesForceClearance
    //         Id={paramvalues["resignationId"]}
    //         context={context}
    //       />
    //     );
    //   case "salesForceClearanceDashboard":
    //     return <SalesForceDashboard props={paramvalues["resignationId"]} />;
    //   case "hrClearance":
    //     return (
    //       <HrClearance Id={paramvalues["resignationId"]} context={context} />
    //     );
    //   case "hrClearanceDashboard":
    //     return <HrClearanceDashboard props={paramvalues["resignationId"]} />;
    //   case "resignationDashboard":
    //     return <ResignationList props={props} />;
    //   case "employeeDetails":
    //     return (
    //       <EmployeeDetails
    //         Id={paramvalues["resignationId"]}
    //         context={context}
    //       />
    //     );
    //   case "employeeDashboard":
    //     return <EmployeeDashboard props={paramvalues["resignationId"]} />;
    //   case "resignationForm":
    //     return (
    //       <ResignationForm
    //         context={context}
    //         props={paramvalues["resignationId"]}
    //       />
    //     );
    //   case "resignationDetail":
    //     return <ResignationDetail props={paramvalues["resignationId"]} />;
    //   case "employeeDashboard":
    //     return <EmployeeDashboard />;
    //   default:
    //     return <Dashboard context={context} />;
    // }
    if (paramvalues["component"]) {
      switch (paramvalues["component"]) {
        case "itClearance":
          return (
            <ItClearance Id={paramvalues["resignationId"]} context={context} />
          );
        case "managerClearance":
          return (
            <ManagerClearance
              Id={paramvalues["resignationId"]}
              context={context}
            />
          );
        case "operationsClearance":
          return (
            <OperationsAdminClearance
              Id={paramvalues["resignationId"]}
              context={context}
            />
          );
        case "financeClearance":
          return (
            <FinanceClearance
              Id={paramvalues["resignationId"]}
              context={context}
            />
          );
        case "salesForceClearance":
          return (
            <SalesForceClearance
              Id={paramvalues["resignationId"]}
              context={context}
            />
          );
        case "hrClearance":
          return (
            <HrClearance Id={paramvalues["resignationId"]} context={context} />
          );
        case "employeeDetails":
          return (
            <EmployeeDetails
              Id={paramvalues["resignationId"]}
              context={context}
            />
          );
        case "resignationForm":
          return (
            <ResignationForm
              context={context}
              props={paramvalues["resignationId"]}
            />
          );
        case "resignationDetail":
          return <ResignationDetail props={paramvalues["resignationId"]} />;
        default:
          return <Dashboard context={context} />;
      }
    } else {
      switch (path) {
        case strings.ResigntionDashboard:
          return <ResignationList props={props} />;
        case strings.ItDashboard:
          return <ITClearanceDashboard />;
        case "https://edifecs.sharepoint.com/sites/PC/SitePages/Manager-Dashboard.aspx":
          return <ManagerClearanceDashboard />;
        case "employeeDashboard":
          return <EmployeeDashboard />;
        case strings.HrDashboard:
          return <HrClearanceDashboard />;
        case strings.SalesForceDashboard:
          return <SalesForceDashboard />;
        case strings.FinanceDashboard:
          return <FinanceDashboard />;
        case strings.OpsDashboard:
          return <OperationsAdminDashboard />;
        case strings.EmployeeDashboard:
          return <EmployeeDashboard />;
        default:
          return <Dashboard context={context} />;
      }
    }
  };

  return <div>{renderChilds()}</div>;
};

export default Navigation;
