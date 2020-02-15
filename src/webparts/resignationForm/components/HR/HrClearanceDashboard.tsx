import * as React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles, withStyles, Theme, Typography, createStyles, Table, TableBody, TableCell, TableHead, TableRow, Paper, Breadcrumbs, Link } from '@material-ui/core';
import { sp } from '@pnp/sp';
import HomeIcon from '@material-ui/icons/Home';
import * as strings from 'ResignationFormWebPartStrings';
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

const HrClearanceDashboard = (props) => {
    const [employeeData, setEmployeeDetail] = useState();
    const getClearanceList = () => {
        sp.web.lists.getByTitle("HrClearance").items.select('Id', 'Status', 'EmployeeNameId', 'EmployeeName/Id', 'EmployeeName/EmployeeCode', 'EmployeeName/EmployeeName', 'EmployeeName/ManagerName').expand("EmployeeName").get().then((items) => {
            if (items.length > 0) {
                setEmployeeDetail(items);
            }
        });
    };
    useEffect(() => {
        getClearanceList();
    }, []);

    const handleClick = (event) => {
        window.location.href = "?component=hrClearance&userId=" + event;
    };
    const redirectHome = (url, userId) => {
        event.preventDefault();
        if (userId) {
            window.location.href = "?component=" + url + "&userId=" + userId;
        } else {
            window.location.href = strings.RootUrl + url;
        }
    };
    const useStyles = makeStyles(theme => ({
        link: {
            display: 'flex',
        },
        icon: {
            marginRight: theme.spacing(0.5),
            width: 20,
            height: 20,
        },
    }));
    const classes = useStyles(0);
    return (
        <Paper className="root removeBoxShadow">
            <div className="">
                <Typography variant="h5" component="h5">
                    HR {strings.Dashboard}
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                    <Link color="inherit" onClick={() => redirectHome("/", "")} className={classes.link}>
                        <HomeIcon className={classes.icon} /> {strings.Home}
                    </Link>
                    <Typography color="textPrimary">HR {strings.Dashboard}</Typography>
                </Breadcrumbs>
                <div>
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

export default HrClearanceDashboard;