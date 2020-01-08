import * as React from 'react';
import { useEffect, useState } from 'react';
import { withStyles, Theme, Typography, createStyles, Table, TableBody, TableCell, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
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


const ITClearanceDashboard = (props) => {
    const [employeeData, setEmployeeDetail] = useState();
    const getClearanceList = () => {
        sp.web.lists.getByTitle("ItClearance").items.select('Id', 'Status', 'EmployeeNameId', 'EmployeeName/Id', 'EmployeeName/EmployeeCode', 'EmployeeName/EmployeeName', 'EmployeeName/ManagerName').expand("EmployeeName").get().then((items) => {
            if (items.length>0) {
                console.log("IT inside", items);
                setEmployeeDetail(items);
            }
            console.log("IT outside", items);
        });
    };
    useEffect(() => {
        getClearanceList();
    }, []);

    const handleClick = (event) => {
        window.location.href = "?component=itClearance&userId=" + event;
    };
    return (
        <Paper className="root">
            <div className="formView">
                <Typography variant="h5" component="h3">
                    IT Clearance Dashboard
                </Typography>
                <div className="tableWrapper">
                    <Table >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell >Employee Code</StyledTableCell>
                                <StyledTableCell >Employee Name</StyledTableCell>
                                <StyledTableCell >Manager name</StyledTableCell>
                                <StyledTableCell >Status</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeeData ? employeeData.map(EmployeeDetail => (
                                <StyledTableRow key={EmployeeDetail.Id} onClick={() => handleClick(EmployeeDetail.Id)} className={(EmployeeDetail.Status == "Pending" || EmployeeDetail.Status == "Not Started" ? 'pendingState' : null)}>
                                    <StyledTableCell component="th" scope="row">{EmployeeDetail.Id}</StyledTableCell>
                                    <StyledTableCell> {EmployeeDetail.EmployeeName.EmployeeCode}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.EmployeeName.EmployeeName}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.EmployeeName.ManagerName}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.Status}</StyledTableCell>
                                </StyledTableRow>
                            )) : <StyledTableRow >
                                    <StyledTableCell colSpan={5} align="center" component="th" scope="row" >No Results found</StyledTableCell>
                                </StyledTableRow>}
                        </TableBody>
                    </Table>
                    
                </div>
            </div>
        </Paper>
    );
};

export default ITClearanceDashboard;