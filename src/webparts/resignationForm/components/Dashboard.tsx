import * as React from "react";
import { useEffect } from "react";
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import '../components/CommonStyleSheet.scss';
import ResignationList from "./Resignations/ResignationList";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3, 2),
        },
    }),
);

const Dashboard = (props) => {
    const handleClick = () => {
        window.location.href = "?component=resignationForm";
    };
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={6}><Button type="button" variant="contained" color="primary" onClick={handleClick}>Offboarding Process</Button></Grid>
                </Grid>
                <Typography variant="h5" component="h3">
                    <h2>Dashboard</h2>
                </Typography>
                <ResignationList />
               
            </Grid>
        </Grid>
    );
};

export default Dashboard;