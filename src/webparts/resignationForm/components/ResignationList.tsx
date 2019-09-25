import * as React from 'react';
import { useEffect } from 'react';
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { sp } from '@pnp/sp';
import './CommonStyleSheet.scss';
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

const getResignationList = () => {
    // get all the items from a list
    sp.web.lists.getByTitle("ResignationList").items.get().then((items: any[]) => {
        EmployeeDetails = items;
        console.log("Employee list",EmployeeDetails);
    });
};
const ResignationList = () => {
  
    useEffect(() => {
        getResignationList();
    });

    return (
        <Paper className="root">
            <div className="tableWrapper">
                <div className ="editButton"><a>Edit</a></div>
                <Table >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell >Employee Code</StyledTableCell>
                            <StyledTableCell >Employee Name</StyledTableCell>
                            <StyledTableCell >Work Email</StyledTableCell>
                            <StyledTableCell >Personal Email</StyledTableCell>
                            <StyledTableCell >Reason for Resignation</StyledTableCell>
                            <StyledTableCell >Specify(If other is selected)</StyledTableCell>
                            <StyledTableCell >Department</StyledTableCell>
                            <StyledTableCell >Title</StyledTableCell>
                            <StyledTableCell >Last Working Date</StyledTableCell>
                            <StyledTableCell >Manager Name</StyledTableCell>
                            <StyledTableCell >Manager Email</StyledTableCell>
                            <StyledTableCell >Resignation Summary</StyledTableCell>
                            <StyledTableCell >Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {EmployeeDetails.map(EmployeeDetail => (
                            <StyledTableRow key={EmployeeDetail.EditorId}>
                                <StyledTableCell component="th" scope="row">
                                    {EmployeeDetail.EditorId}
                                </StyledTableCell>
                                <StyledTableCell> {EmployeeDetail.EmployeeCode}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.EmployeeName}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.WorkEmail}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.PersonalEmail}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.ResignationReason}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.OtherReason}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.Department}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.LastWorkingDate}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.ResignationReason}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.ManagerName}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.ManagerEmail}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.ResignationSummary}</StyledTableCell>
                                <StyledTableCell ><Button type="submit" fullWidth className="marginTop16" variant="contained"  color="primary">Check Status</Button></StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Paper>
    );
};

export default ResignationList;