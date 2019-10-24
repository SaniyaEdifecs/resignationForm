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
import {Link} from 'react-router-dom';


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

const getResignationList = (userDetails) => {
    // current user email id
        console.log("userdetails",userDetails);
        if (userDetails.userId && userDetails.IsSiteAdmin) {
            sp.web.lists.getByTitle("ResignationList").items.get().then((items: any) => {
                EmployeeDetails = items;
            });
        }
        else {
            sp.web.lists.getByTitle("ResignationList").items.getById(userDetails.userId).get().then((items: any) => {
                EmployeeDetails = items;
            });
        }

   
};
const ResignationList = (props) => {
    console.log("list", props);
    let userDetails = {
        userId : props.props.match.params.ID,
        IsSiteAdmin : props.props.IsSiteAdmin
    };
    useEffect(() => {
        getResignationList(userDetails);
    },[]);

    return (
        <Paper className="root">
            <div className="tableWrapper">
                <div className="editButton"><a>Edit</a></div>
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
                            <StyledTableCell >Job Title</StyledTableCell>
                            <StyledTableCell >Manager Name</StyledTableCell>
                            <StyledTableCell >Manager Email</StyledTableCell>
                            <StyledTableCell >Resignation Summary</StyledTableCell>
                            <StyledTableCell >Status</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {EmployeeDetails.length > 0 ? EmployeeDetails.map(EmployeeDetail => (
                            <StyledTableRow key={EmployeeDetail.EditorId}>
                                <StyledTableCell component="th" scope="row">{EmployeeDetail.ID}</StyledTableCell>
                                <StyledTableCell> {EmployeeDetail.EmployeeCode}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.FirstName} {EmployeeDetail.lastName}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.WorkEmail}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.PersonalEmail}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.ResignationReason}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.OtherReason}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.Department}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.JobTitle}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.ManagerFirstName} {EmployeeDetail.ManagerLastName}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.ManagerEmail}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.ResignationSummary}</StyledTableCell>
                                <StyledTableCell ><Link to={{pathname:'/clearanceDashboard/' + EmployeeDetail.ID}}>Check Status</Link></StyledTableCell>
                            </StyledTableRow>
                        )) : <StyledTableRow key={EmployeeDetails.EditorId}>
                                <StyledTableCell component="th" scope="row">{EmployeeDetails.ID}</StyledTableCell>
                                <StyledTableCell> {EmployeeDetails.EmployeeCode}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.FirstName} {EmployeeDetails.lastName}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.WorkEmail}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.PersonalEmail}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.ResignationReason}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.OtherReason}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.Department}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.JobTitle}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.ManagerFirstName} {EmployeeDetails.ManagerLastName}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.ManagerEmail}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.ResignationSummary}</StyledTableCell>
                                <StyledTableCell ><Link to={{pathname:'/clearanceDashboard/' + EmployeeDetails.ID}}>Check Status</Link></StyledTableCell>
                                    
                            </StyledTableRow>}
                    </TableBody>
                </Table>
            </div>
        </Paper>
    );
};

export default ResignationList;