import * as React from "react";
import { useEffect } from "react";
import { Grid, Paper, Typography, Button, Box } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { typography } from '@material-ui/system';
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
                <Grid container justify="flex-end">
                    <Grid item xs={6} >
                    </Grid>
                    <Grid item xs={6} className="rightAlign" >
                        <Button type="button" variant="contained" color="primary" onClick={handleClick}>Initiate Offboarding Form</Button>
                    </Grid>
                </Grid>
                <ResignationList />
            </Grid>
        </Grid>
    );
};

export default Dashboard;