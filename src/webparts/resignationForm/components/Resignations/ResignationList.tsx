import * as React from 'react';
import { useEffect, useState } from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { sp } from '@pnp/sp';
import '../CommonStyleSheet.scss';
import { Typography, List } from '@material-ui/core';

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

const ResignationList = (props) => {
    console.log('List', props);
    const [employeeList, setEmployeeList] = useState();
    const getResignationList = () => {
        sp.web.lists.getByTitle("ResignationList").items.get().then((items: any) => {
            if (items.length > 0) {
                setEmployeeList(items);
                console.log("Listing", items);
            }
        });
    };

    useEffect(() => {
        getResignationList();
    }, []);

    const handleClick = (event) => {
        // window.history.pushState({urlPath:'/"?component=resignationDetail&userId="' + event'},"",'/page1')
        window.location.href = "?component=resignationDetail&userId=" + event;
    };

    return (
        <Paper className="root">
            <div className="formView">
                <Typography variant="h5" component="h3">
                    Resignation Dashboard
                </Typography>
                <div className="tableWrapper">
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell >Employee Code</StyledTableCell>
                                <StyledTableCell >Employee Name</StyledTableCell>
                                <StyledTableCell >Work Email</StyledTableCell>
                                <StyledTableCell >Personal Email</StyledTableCell>
                                <StyledTableCell >Reason for Resignation</StyledTableCell>
                                <StyledTableCell >Department</StyledTableCell>
                                <StyledTableCell >Status</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employeeList ? employeeList.map(employeeDetail => (
                                <StyledTableRow key={employeeDetail.ID} onClick={() => handleClick(employeeDetail.ID)}>
                                    <StyledTableCell component="th" scope="row"> {employeeDetail.EmployeeCode}</StyledTableCell>
                                    <StyledTableCell >{employeeDetail.EmployeeName}</StyledTableCell>
                                    <StyledTableCell >{employeeDetail.WorkEmail}</StyledTableCell>
                                    <StyledTableCell >{employeeDetail.PersonalEmail}</StyledTableCell>
                                    <StyledTableCell >{employeeDetail.ResignationReason}</StyledTableCell>
                                    <StyledTableCell >{employeeDetail.Department}</StyledTableCell>
                                    <StyledTableCell >{employeeDetail.Status}</StyledTableCell>
                                </StyledTableRow>
                            )) : <StyledTableRow>
                                    <StyledTableCell colSpan={7} component="th" scope="row" align="center" >No Results Found</StyledTableCell>
                                </StyledTableRow>}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Paper>
    );
};

export default ResignationList;