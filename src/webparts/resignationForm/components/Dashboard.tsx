import * as React from "react";
import { useEffect, useState } from "react";
import * as strings from 'ResignationFormWebPartStrings';
import { Grid, Button } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import '../components/CommonStyleSheet.scss';
import ResignationList from "./Resignations/ResignationList";
import { sp } from "@pnp/sp";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3, 2),
        },
    }),
);

const Dashboard = (props) => {
    let currentUser: any;
    const [hideButton, setHideButton] = useState(false);


    const setEditAccessPermissions = () => {
        sp.web.currentUser.get().then((response) => {
            currentUser = response;
            console.log("==", currentUser);
            if (currentUser) {
                const url = strings.RootUrl +"/_api/web/sitegroups/getByName('Resignation Group - Owners')/Users?$filter=Id eq " + currentUser.Id;
                props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
                    .then((response: SPHttpClientResponse): Promise<any> => {
                        return response.json();
                    }).then(permissionResponse => {
                        console.log("permissions reponse==", permissionResponse);
                        let permissionLevel = permissionResponse;
                        if (permissionLevel.value.length > 0) {
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
        <div className="dashboardWrapper">
            <Grid container spacing={3}>
                {/* <Grid item xs={12}>
                    <MessageBar>Click on Initiate Clearance Form button to initiate Clearance process for an associate.</MessageBar>
                </Grid> */}
                {hideButton ? "" :
                    <Grid item xs={12} className="rightAlign marginTop16" >
                        <Button type="button" variant="contained" color="primary" onClick={handleClick}>Initiate Clearance Form</Button>
                    </Grid>}
            </Grid>
            <Grid container spacing={3} className="marginTop16 ">
                <Grid item xs={6} sm={4} justify="center" className="marginTop16">
                    <a href="https://edifecs.sharepoint.com/sites/PC/SitePages/Clearance-Dashboard.aspx" target="_blank">
                        <i className='ms-Icon ms-Icon--BulletedList' aria-hidden="true"></i> <br /> Clearance {strings.Dashboard}
                    </a>
                </Grid>
                <Grid item xs={6} sm={4} justify="center" className="marginTop16">
                    <a href="https://edifecs.sharepoint.com/sites/PC/SitePages/HR-Dashboard.aspx" target="_blank">
                        <i className="ms-Icon ms-Icon--People" aria-hidden="true"></i> <br /> HR {strings.Dashboard}
                    </a>
                </Grid>
                <Grid item xs={6} sm={4} justify="center" className="marginTop16">
                    <a href="https://edifecs.sharepoint.com/sites/PC/SitePages/IT-Dashboard.aspx">
                        <i className="ms-Icon ms-Icon--LaptopSelected" aria-hidden="true"></i> <br /> IT {strings.Dashboard}
                    </a>
                </Grid>
                <Grid item xs={6} sm={4} className="marginTop16">
                    <a href="https://edifecs.sharepoint.com/sites/PC/SitePages/Operations-Dashboard.aspx" target="_blank">
                        <i className="ms-Icon ms-Icon--Settings" aria-hidden="true"></i> <br /> Operations {strings.Dashboard}
                    </a>
                </Grid>
                <Grid item xs={6} sm={4} className="marginTop16">
                    <a href="https://edifecs.sharepoint.com/sites/PC/SitePages/Finance-Dashboard.aspx" target="_blank">
                        <i className="ms-Icon ms-Icon--Money" aria-hidden="true"></i> <br /> Finance {strings.Dashboard}
                    </a>
                </Grid>
                <Grid item xs={6} sm={4} className="marginTop16">
                    <a href="https://edifecs.sharepoint.com/sites/PC/SitePages/SalesForce-Dashboard.aspx" target="_blank">
                        <i className="ms-Icon ms-Icon--AzureAPIManagement" aria-hidden="true"></i> <br /> SalesForce {strings.Dashboard}
                    </a>
                </Grid>
                <Grid item xs={6} sm={4} className="marginTop16">
                    <a href="https://edifecs.sharepoint.com/sites/PC/SitePages/Manager-Dashboard.aspx" >
                        <i className="ms-Icon ms-Icon--PartyLeader" aria-hidden="true"></i> <br />  Manager {strings.Dashboard}
                    </a>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;