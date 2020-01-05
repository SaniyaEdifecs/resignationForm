import * as React from 'react';
import { useEffect, useState } from 'react';
import { withStyles, Theme, Typography, createStyles, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import { sp } from '@pnp/sp';
import '../CommonStyleSheet.scss';

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

const EmployeeDashboard = (props) => {
    const [employeeData, setEmployeeDetail] = useState();
    const getClearanceList = () => {
        sp.web.lists.getByTitle("Employee%20Details").items.select('Id', 'Status', 'EmployeeName/Id', 'FirstName','LastName').expand("EmployeeName").get().then((items) => {
            if (items.length > 0) {
                setEmployeeDetail(items);
            }
        });
    };
    useEffect(() => {
        getClearanceList();
    }, []);

    const handleClick = (event) => {
        window.location.href = "?component=employeeDetails&userId=" + event;
    };

    return (
        <Paper className="root">
            <div className="formView">
                <Typography variant="h5" component="h3">
                   Employee Clearance Dashboard
                </Typography>
                <div className="tableWrapper">
                    <Table >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell >Employee Code</StyledTableCell>
                                <StyledTableCell >First Name</StyledTableCell>
                                <StyledTableCell >Last name</StyledTableCell>
                                <StyledTableCell >Personal Email</StyledTableCell>
                                <StyledTableCell >Personal Phone</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeeData ? employeeData.map(EmployeeDetail => (
                                <StyledTableRow key={EmployeeDetail.Id} onClick={() => handleClick(EmployeeDetail.Id)} className={(EmployeeDetail.Status == "Pending" || EmployeeDetail.Status == "Not Started" ? 'pendingState' : null)}>
                                    <StyledTableCell component="th" scope="row">{EmployeeDetail.Id}</StyledTableCell>
                                    <StyledTableCell> {EmployeeDetail.EmployeeCode}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.FirstName}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.LastName}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.PersonalEmail}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.PersonalPhone}</StyledTableCell>
                                </StyledTableRow>
                            )) : <StyledTableRow >
                                    <StyledTableCell colSpan={6} align="center" component="th" scope="row" >No Results found</StyledTableCell>
                                </StyledTableRow>}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Paper>
    );
};

export default EmployeeDashboard;