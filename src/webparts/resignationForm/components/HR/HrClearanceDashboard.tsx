import * as React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles, withStyles, Theme, Typography, createStyles, Table, TableBody, TableHead, Paper, TableCell, TableRow, Breadcrumbs, Link, TableFooter, TablePagination, useTheme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home';
import * as strings from 'ResignationFormWebPartStrings';
import '../CommonStyleSheet.scss';
import SharePointService from '../SharePointServices';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';


const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
    const classes = useStyles1(0);
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (<div className={classes.root}>
        <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
        >
            {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
        >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
        >
            {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
        </IconButton>
    </div>
    );
};


const HrClearanceDashboard = (props) => {
    const [employeeDetails, setEmployeeDetails] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loader, showLoader] = useState(false);

    const getClearanceList = () => {
        showLoader(true);
        SharePointService.getListByTitle("HrClearance").items.select('Id', 'Status', 'EmployeeNameId', 'EmployeeName/Id', 'EmployeeName/EmployeeCode', 'EmployeeName/EmployeeName', 'EmployeeName/ManagerName').expand("EmployeeName").get().then((items: any) => {
            showLoader(false);
            if (items) {
                setEmployeeDetails(items);
                console.log("details ==", employeeDetails);
            }
        }).catch(err => {
            showLoader(false);
            if (err) {
                setErrorMsg("No Records Found");
            }
        });
    };
    useEffect(() => {
        getClearanceList();
    }, []);
    // Table Pagination
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };


    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleClick = (event) => {
        window.location.href = "?component=hrClearance&resignationId=" + event;
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
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                        <HomeIcon className={classes.icon} /> {strings.Home}
                    </Link>
                    <Typography color="textPrimary">HR {strings.Dashboard}</Typography>
                </Breadcrumbs>
                <div>
                    {loader ? <div className="msSpinner">
                        <Spinner label="Fetching data, wait..." size={SpinnerSize.large} />
                    </div> :
                        <Table >
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell >Employee Code</TableCell>
                                    <TableCell >Employee Name</TableCell>
                                    <TableCell >Manager name</TableCell>
                                    <TableCell >Status</TableCell>
                                </TableRow>
                            </TableHead>
                            {employeeDetails.length > 0 ? <TableBody>
                                {(rowsPerPage > 0
                                    ? employeeDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : employeeDetails
                                ).map((EmployeeDetail, index) => (
                                    <TableRow key={EmployeeDetail.Id} onClick={() => handleClick(EmployeeDetail.Id)} className={(EmployeeDetail.Status == "Pending" || EmployeeDetail.Status == "Not Started" ? 'pendingState' : null)}>
                                        <TableCell component="th" scope="row">{EmployeeDetail.Id}</TableCell>
                                        <TableCell> {EmployeeDetail.EmployeeName.EmployeeCode}</TableCell>
                                        <TableCell >{EmployeeDetail.EmployeeName.EmployeeName}</TableCell>
                                        <TableCell >{EmployeeDetail.EmployeeName.ManagerName}</TableCell>
                                        <TableCell >{EmployeeDetail.Status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody> : <TableBody> <TableRow>
                                <TableCell colSpan={5} >
                                    {errorMsg ? <div>No Records Found</div> : "No Records Found"}
                                </TableCell>
                            </TableRow>
                                </TableBody>
                            } <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, employeeDetails.length > 25 && employeeDetails.length]}
                                        colSpan={5}
                                        count={employeeDetails.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: { 'aria-label': 'rows per page' },
                                            native: true,
                                        }}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>}
                </div>
            </div>
        </Paper>
    );
};

export default HrClearanceDashboard;