import * as React from "react";
import { useEffect, useState } from "react";
import * as strings from 'ResignationFormWebPartStrings';
import { Grid, Button, Link } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import '../components/CommonStyleSheet.scss';
import { sp } from "@pnp/sp";
import SharePointService from "./SharePointServices";

const Dashboard = (props) => {
    let currentUser: any;
    const [hideButton, setHideButton] = useState(false);

    const setEditAccessPermissions = () => {
        sp.web.currentUser.get().then((response) => {
            currentUser = response;
            console.log("==", currentUser);
            if (currentUser) {
                SharePointService.getCurrentUserGroups().then((groups: any) => {
                    console.log('group list', groups);

                    let isGroupOwner = groups.filter(group => group.Title === "Resignation Group - Owners").length;
                    if (isGroupOwner) {
                        setHideButton(false);
                    } else {
                        setHideButton(true);
                    }
                });
     

            }
        });
    };
    useEffect(() => {
        setEditAccessPermissions();
    }, []);
    const handleClick = () => {
        window.location.href = "?component=resignationForm";
    };
    return (
        <div className="dashboardWrapper" >
            <Grid container spacing={3} >
                {hideButton ? "" :
                    <Grid item xs={12} className="marginTop16 centerAlign" justify="center">
                        <Button type="button" variant="contained" color="primary" onClick={handleClick}>Initiate Clearance Form</Button>
                    </Grid>}
            </Grid>
            <Grid container spacing={3} className="marginTop16 ">
                <Grid item xs={6} sm={4} justify="center" className="marginTop16">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.ResigntionDashboard, "")}>
                        <i className='ms-Icon ms-Icon--BulletedList' aria-hidden="true"></i> <br /> Clearance {strings.Dashboard}
                    </Link>

                </Grid>
                <Grid item xs={6} sm={4} justify="center" className="marginTop16">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HrDashboard, "")}>
                        <i className='ms-Icon ms-Icon--People' aria-hidden="true"></i> <br />  P&C {strings.Dashboard}
                    </Link>

                </Grid>
                <Grid item xs={6} sm={4} justify="center" className="marginTop16">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.ItDashboard, "")}>
                        <i className='ms-Icon ms-Icon--LaptopSelected' aria-hidden="true"></i> <br />  IT {strings.Dashboard}
                    </Link>
                </Grid>
                <Grid item xs={6} sm={4} className="marginTop16">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.OpsDashboard, "")}>
                        <i className='ms-Icon ms-Icon--Settings' aria-hidden="true"></i> <br />  Operations {strings.Dashboard}
                    </Link>
                </Grid>
                <Grid item xs={6} sm={4} className="marginTop16">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.FinanceDashboard, "")}>
                        <i className='ms-Icon ms-Icon--Money' aria-hidden="true"></i> <br />  Finance {strings.Dashboard}
                    </Link>
                </Grid>
                <Grid item xs={6} sm={4} className="marginTop16">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.SalesForceDashboard, "")}>
                        <i className='ms-Icon ms-Icon--AzureAPIManagement' aria-hidden="true"></i> <br />  SalesForce {strings.Dashboard}
                    </Link>
                </Grid>
                <Grid item xs={6} sm={4} className="marginTop16">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.ManagerDashboard, "")}>
                        <i className='ms-Icon ms-Icon--AzureAPIManagement' aria-hidden="true"></i> <br />  Manager {strings.Dashboard}
                    </Link>

                </Grid>
                <Grid item xs={6} sm={4} className="marginTop16">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.EmployeeDashboard, "")}>
                        <i className='ms-Icon ms-Icon--TemporaryUser' aria-hidden="true"></i> <br />  Employee {strings.Dashboard}
                    </Link>

                </Grid>
            </Grid >
        </div >
    );
};

export default Dashboard;