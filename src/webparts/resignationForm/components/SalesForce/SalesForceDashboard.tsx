import * as React from 'react';
import { useEffect } from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { sp } from '@pnp/sp';
import '../CommonStyleSheet.scss';
import { Button } from '@material-ui/core';


let EmployeeDetails: any = [];
const StyledTableCell = withStyles((theme: Theme) =>
    createStyles({
        head: {
            backgroundColor: theme.palette.common.white,
        },
        body: {
            fontSize: 12,

        },
    }),
)(TableCell);
const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            fontSize: 13,
            fontWeight: 600,
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.background.default,
            },
        },
    }),
)(TableRow);

const getSalesForceClearanceList = () => {
    // current user email id
    sp.web.currentUser.get().then((response) => {
        console.log("Current user details", response);
        let userId = response.Id;

        if (userId && response.IsSiteAdmin) {
            sp.web.lists.getByTitle("SalesForce%20Clearance").items.get().then((items: any) => {
                EmployeeDetails = items;
            });
        }
        else {
            sp.web.lists.getByTitle("SalesForce%20Clearance").items.getById(userId).get().then((items: any) => {
                EmployeeDetails = items;
                console.log("get a specific item by id", EmployeeDetails);

            });
        }

    });
};
const SalesForceDashboard = () => {

    useEffect(() => {
        getSalesForceClearanceList();
    });

    return (
        <Paper className="root">
            <div className="tableWrapper">
                <Table >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell>License Termination</StyledTableCell>
                            <StyledTableCell >License Termination Comment</StyledTableCell>
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {EmployeeDetails.length > 0 ? EmployeeDetails.map(EmployeeDetail => (
                            <StyledTableRow key={EmployeeDetail.ID}>
                                <StyledTableCell component="th" scope="row">{EmployeeDetail.ID}</StyledTableCell>
                                <StyledTableCell> {EmployeeDetail.LicenseTermination}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.LicenseTerminationComment}</StyledTableCell>
                                
                            </StyledTableRow>
                        )) : <StyledTableRow key={EmployeeDetails.ID}>
                                <StyledTableCell component="th" scope="row">{EmployeeDetails.ID}</StyledTableCell>
                                <StyledTableCell> {EmployeeDetails.LicenseTermination}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.LicenseTerminationComment}</StyledTableCell>
                            </StyledTableRow>}
                    </TableBody>
                </Table>
            </div>
        </Paper>
    );
};

export default SalesForceDashboard;