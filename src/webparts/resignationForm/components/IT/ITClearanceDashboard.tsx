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

const getItClearanceList = () => {
    // current user email id
    sp.web.currentUser.get().then((response) => {
        console.log("Current user details", response);
        let userId = response.Id;

        if (userId && response.IsSiteAdmin) {
            sp.web.lists.getByTitle("ItClearance").items.get().then((items: any) => {
                EmployeeDetails = items;
            });
        }
        else {
            sp.web.lists.getByTitle("ItClearance").items.getById(userId).get().then((items: any) => {
                EmployeeDetails = items;
                console.log("get a specific item by id", EmployeeDetails);

            });
        }

    });
};
const ITClearanceDashboard = () => {
    useEffect(() => {
        getItClearanceList();
    });

    return (
        <Paper className="root">
            <div className="tableWrapper">
                <Table >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell >Access Card</StyledTableCell>
                            <StyledTableCell >Access Card Comments</StyledTableCell>
                            <StyledTableCell >Access Removal</StyledTableCell>
                            <StyledTableCell >Access Removal Comments</StyledTableCell>
                            <StyledTableCell >Data Backup</StyledTableCell>
                            <StyledTableCell >Data Backup Comments</StyledTableCell>
                            <StyledTableCell >Data Card</StyledTableCell>
                            <StyledTableCell >Data Card Comments</StyledTableCell>
                            <StyledTableCell >Laptop/Desktop Comments</StyledTableCell>
                            <StyledTableCell >Desktop Comments</StyledTableCell>
                            <StyledTableCell >ID Card</StyledTableCell>
                            <StyledTableCell >ID Card Comments</StyledTableCell>
                            <StyledTableCell >Others- Chargers, mouse, headphones etc</StyledTableCell>
                            <StyledTableCell >Other Comments</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {EmployeeDetails.length > 0 ? EmployeeDetails.map(EmployeeDetail => (
                            <StyledTableRow key={EmployeeDetail.ID}>
                                <StyledTableCell component="th" scope="row">{EmployeeDetail.ID}</StyledTableCell>
                                <StyledTableCell> {EmployeeDetail.AccessCard}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.AccessCardComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.AccessRemoval}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.AccessRemovalComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.DataBackup}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.DataBackupComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.DataCard}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.DataCardComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.DesktopComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.IDCard}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.IDCardComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.Laptop_x002f_Desktop}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.PeripheralDevices}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.peripheralDevicesComments}</StyledTableCell>
                            </StyledTableRow>
                        )) : <StyledTableRow key={EmployeeDetails.ID}>
                                <StyledTableCell component="th" scope="row">{EmployeeDetails.ID}</StyledTableCell>
                                <StyledTableCell> {EmployeeDetails.AccessCard}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.AccessCardComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.AccessRemoval}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.AccessRemovalComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.DataBackup}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.DataBackupComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.DataCard}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.DataCardComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.DesktopComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.IDCard}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.IDCardComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.Laptop_x002f_Desktop}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.PeripheralDevices}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.peripheralDevicesComments}</StyledTableCell>

                            </StyledTableRow>}
                    </TableBody>
                </Table>
            </div>
        </Paper>
    );
};

export default ITClearanceDashboard;