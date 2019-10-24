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

const getFinanceClearanceList = () => {
    // current user email id
    sp.web.currentUser.get().then((response) => {
        console.log("Current user details", response);
        let userId = response.Id;

        if (userId && response.IsSiteAdmin) {
            sp.web.lists.getByTitle("Finance%20Clearance").items.get().then((items: any) => {
                EmployeeDetails = items;
            });
        }
        else {
            sp.web.lists.getByTitle("Finance%20Clearance").items.getById(userId).get().then((items: any) => {
                EmployeeDetails = items;
                console.log("get a specific item by id", EmployeeDetails);

            });
        }

    });
};
const FinanceDashboard = () => {

    useEffect(() => {
        getFinanceClearanceList();
    });

    return (
        <Paper className="root">
            <div className="tableWrapper">
                <Table >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell>Biometric Access</StyledTableCell>
                            <StyledTableCell >Biometric Access Comments</StyledTableCell>
                            <StyledTableCell >Kuoni Concur Access</StyledTableCell>
                            <StyledTableCell >Kuoni Concur Access Comments</StyledTableCell>
                            <StyledTableCell >Library Books</StyledTableCell>
                            <StyledTableCell >Library Books Comments</StyledTableCell>
                            <StyledTableCell >Pedestal Keys</StyledTableCell>
                            <StyledTableCell >Pedestal Keys Comments</StyledTableCell>
                            <StyledTableCell >Sim Card</StyledTableCell>
                            <StyledTableCell >Sim Card Comments</StyledTableCell>
                            <StyledTableCell >Sticker</StyledTableCell>
                            <StyledTableCell >Sticker Comments</StyledTableCell>
                            <StyledTableCell >Visiting Cards</StyledTableCell>
                            <StyledTableCell >Visiting Cards Comments</StyledTableCell>
                            <StyledTableCell >Other(Specify)</StyledTableCell>
                            <StyledTableCell >Others Comments</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {EmployeeDetails.length > 0 ? EmployeeDetails.map(EmployeeDetail => (
                            <StyledTableRow key={EmployeeDetail.ID}>
                                <StyledTableCell component="th" scope="row">{EmployeeDetail.ID}</StyledTableCell>
                                <StyledTableCell> {EmployeeDetail.BiometricAccess}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.BiometricAccessComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.KuoniConcurAccess}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.KuoniConcurAccessComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.LibraryBooks}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.LibraryBooksComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.PedestalKeys}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.PedestalKeysComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.SimCard}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.SimCardComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.Stickers}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.StickerComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.VisitingCards}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.VisitingCardsComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.Others}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetail.OthersComments}</StyledTableCell>
                                
                            </StyledTableRow>
                        )) : <StyledTableRow key={EmployeeDetails.ID}>
                                <StyledTableCell component="th" scope="row">{EmployeeDetails.ID}</StyledTableCell>
                                <StyledTableCell> {EmployeeDetails.BiometricAccess}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.BiometricAccessComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.KuoniConcurAccess}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.KuoniConcurAccessComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.LibraryBooks}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.LibraryBooksComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.PedestalKeys}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.PedestalKeysComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.SimCard}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.SimCardComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.Stickers}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.StickerComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.VisitingCards}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.VisitingCardsComments}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.Others}</StyledTableCell>
                                <StyledTableCell >{EmployeeDetails.OthersComments}</StyledTableCell>
                            </StyledTableRow>}
                    </TableBody>
                </Table>
            </div>
        </Paper>
    );
};

export default FinanceDashboard;