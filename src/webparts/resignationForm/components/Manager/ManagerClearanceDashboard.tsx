import * as React from 'react';
import { useEffect } from 'react';
import { withStyles, Theme, Typography, createStyles, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@material-ui/core';
import { sp } from '@pnp/sp';
import '../CommonStyleSheet.scss';

let EmployeeDetails: any = [];
let ID: any;
let list = sp.web.lists.getByTitle("ManagersClearance").items.select("Status", "ID");
let employeeData:any =[];
// let intergatedEmployeeData :any=[];
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

const getClearanceList = () => {
    // current user email id
    // sp.web.lists.getByTitle("ResignationList").items.select("ID", "EmployeeCode", "EmployeeName", "ManagerName").get().then((items: any) => {
    //     employeeData = items;
    //     console.log("resignation list", employeeData);
    // })
    sp.web.currentUser.get().then((response) => {
        // console.log("Current user details", response);
        let userId = response.Id;

        if (userId && response.IsSiteAdmin) {
            list.get().then((items: any) => {
                EmployeeDetails = items;
            });
        }
        else {
            list.getById(userId).get().then((items: any) => {
                EmployeeDetails = items;
            });
        }
        console.log("clearance list select",EmployeeDetails )
    });
};

const ManagerClearanceDashboard = (props) => {
    console.log("props dashboard", props);
    sp.web.lists.getByTitle("ManagersClearance").items.get().then((items: any) => {
        let EmployeeDetails = items;
                console.log("data list0000000000======", EmployeeDetails);
            });
    // ID = props.props;
    // useEffect(() => {
        // console.log("props dashboard inside", props);
        getClearanceList();
        sp.web.lists.getByTitle("ResignationList").items.select("ID", "EmployeeCode", "EmployeeName", "ManagerName").get().then((items: any) => {
            employeeData = items;
            console.log("resignation list======", employeeData);
        });
        
        EmployeeDetails =  EmployeeDetails.map(x =>(Object as any).assign(x, employeeData.find(y => y.ID == x.ID)));
    
        console.log('groupdata======', EmployeeDetails);
    // }, [EmployeeDetails]);

    const handleClick = (event) =>{
        console.log("onclick event",event);
        window.location.href="?component=managerClearance&Id="+event;
    };
    return (
       <Paper className="root">
            <div className="formView">
                <Typography variant="h5" component="h3">
                    Clearance Dashboard
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
                            {EmployeeDetails.length > 0 ? EmployeeDetails.map(EmployeeDetail => (
                                <StyledTableRow key={EmployeeDetail.ID} onClick={()=>handleClick(EmployeeDetail.ID)} className={(EmployeeDetail.Status == "Pending" || EmployeeDetail.Status == "Not Started"? 'pendingState' : null)}>
                                    <StyledTableCell component="th" scope="row">{EmployeeDetail.ID}</StyledTableCell>
                                    <StyledTableCell> {EmployeeDetail.EmployeeCode}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.EmployeeName}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.ManagerName}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetail.Status}</StyledTableCell>
                                </StyledTableRow>
                            )) : <StyledTableRow key={EmployeeDetails.ID} onClick={()=>handleClick(EmployeeDetails.ID)} className={(EmployeeDetails.Status == "Pending" || EmployeeDetails.Status == "Not Started" ? 'pendingState' : null)}>
                                    <StyledTableCell component="th" scope="row">{EmployeeDetails.ID}</StyledTableCell>
                                    <StyledTableCell> {EmployeeDetails.EmployeeCode}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetails.EmployeeName}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetails.ManagerName}</StyledTableCell>
                                    <StyledTableCell >{EmployeeDetails.Status}</StyledTableCell>
                                </StyledTableRow>}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Paper> 
    );
};

export default ManagerClearanceDashboard;