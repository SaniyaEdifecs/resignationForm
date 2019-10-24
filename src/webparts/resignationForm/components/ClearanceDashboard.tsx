import * as React from "react";
import { useEffect } from "react";
import { Grid, Paper, Typography } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { sp } from "@pnp/sp";

let userID: any;
let ItClearanceDetails: any;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3, 2),
        },
    }),
);

const ClearanceDashboard = (props) => {
    console.log("clearancedashboard", props);
    const classes = useStyles(0);
    userID = props.match.params.ID;
        sp.web.lists.getByTitle("ItClearance").items.getById(userID).get().then((items: any) => {
            ItClearanceDetails = items || [];
            console.log("dddd",ItClearanceDetails);
        });

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <Paper className={classes.root}>
                    <Typography variant="h5" component="h3">
                     Clearance Status
                     </Typography>
                    <Typography component="div">
                        <Grid container>
                            <Grid item xs={6}>IT Clearance</Grid>
                            <Grid item xs={6}>{}</Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={6}></Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={6}></Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={6}></Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={6}></Grid>
                        </Grid>
                    </Typography>
                </Paper>
            </Grid>
           
        </Grid>
    );
};

export default ClearanceDashboard;