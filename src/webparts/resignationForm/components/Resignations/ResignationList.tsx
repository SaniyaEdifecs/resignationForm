import * as React from 'react';
import { useEffect, useState } from 'react';
import { withStyles, Theme, Typography, createStyles, Table, TableBody, TableCell, TableHead, TableRow, Paper, TablePagination, Breadcrumbs, Link, makeStyles, useTheme, TableFooter } from '@material-ui/core';
import { sp } from '@pnp/sp';
import IconButton from '@material-ui/core/IconButton';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home';
import ConfirmationDialog from '../ConfirmationDialog';
import '../CommonStyleSheet.scss';
import * as strings from 'ResignationFormWebPartStrings';
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

const ResignationList = (props) => {
    const [employeeLists, setEmployeeLists] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loader, showLoader] = useState(false);
    const [showActionButton, setShowActionButton] = useState(true);
    const [dialogData, setDialogData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    let isResignationOwner: boolean = false;
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

    const getResignationList = () => {
        showLoader(true);
        sp.web.lists.getByTitle("ResignationList").items.get().then((items: any) => {
            showLoader(false);
            if (items) {
                setEmployeeLists(items);
            }
        }).catch(err => {
            showLoader(false);
            setErrorMsg("No Records Found");
        });
    };


    const handleClick = (event) => {
        window.location.href = "?component=resignationDetail&resignationId=" + event;
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
    const redirectHome = (url, resignationId) => {
        event.preventDefault();
        if (resignationId) {
            window.location.href = "?component=" + url + "&resignationId=" + resignationId;
        } else {
            window.location.href = strings.RootUrl + url;
        }
    };

    const checkResignationOwner = () => {
        sp.web.currentUser.groups.get().then((groupAccess: any) => {
            console.log(groupAccess);
            groupAccess.forEach(groupName => {
                if (groupName.Title == "Resignation Group - Owners") {
                    isResignationOwner = true;
                    setShowActionButton(true);
                }
                else {
                    isResignationOwner = false;
                    setShowActionButton(true);
                }
            });
            console.log('owners', isResignationOwner);

            return isResignationOwner;
        });
    };
    const handleChildClick = (value: boolean) => {
        setOpenDialog(value);
        console.log("child click", openDialog, value);
        if (openDialog) {
            getResignationList();
        }
    }
    const openConfirmationDialog = (employeeDetail) => {
        setDialogData(employeeDetail);
        setOpenDialog(true);
    }

    useEffect(() => {
        getResignationList();
        checkResignationOwner();
    }, []);

    useEffect(() => {
    }, [openDialog]);

    return (
        <div>
            <ConfirmationDialog props={openDialog} content={dialogData} onChildClick={handleChildClick} />
            <Paper className="root removeBoxShadow">

                <div className="">
                    <Typography variant="h5" component="h5">
                        Clearance {strings.Dashboard}
                    </Typography>
                    <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                        <Link color="inherit" onClick={() => redirectHome("/", "")} className={classes.link}>
                            <HomeIcon className={classes.icon} /> {strings.Home}
                        </Link>
                        <Typography color="textPrimary">Clearance {strings.Dashboard}</Typography>
                    </Breadcrumbs>
                    <div>
                        {loader ? <div className="msSpinner">
                            <Spinner label="Fetching data, wait..." size={SpinnerSize.large} />
                        </div> :
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell >Employee Code</TableCell>
                                        <TableCell >Employee Name</TableCell>
                                        <TableCell >Work Email</TableCell>
                                        <TableCell >Personal Email</TableCell>
                                        <TableCell >Reason for Resignation</TableCell>
                                        <TableCell >Department</TableCell>
                                        <TableCell >Status</TableCell>
                                        {showActionButton ? <TableCell >Action</TableCell> : null}
                                    </TableRow>
                                </TableHead>
                                {employeeLists.length > 0 ? <TableBody>
                                    {(rowsPerPage > 0
                                        ? employeeLists.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : employeeLists
                                    ).map((employeeDetail) => (
                                        <TableRow key={employeeDetail.ID} >
                                            <TableCell onClick={() => handleClick(employeeDetail.ID)}> {employeeDetail.EmployeeCode}</TableCell>
                                            <TableCell onClick={() => handleClick(employeeDetail.ID)}>{employeeDetail.EmployeeName}</TableCell>
                                            <TableCell onClick={() => handleClick(employeeDetail.ID)}>{employeeDetail.WorkEmail}</TableCell>
                                            <TableCell onClick={() => handleClick(employeeDetail.ID)}>{employeeDetail.PersonalEmail}</TableCell>
                                            <TableCell onClick={() => handleClick(employeeDetail.ID)}>{employeeDetail.ResignationReason}</TableCell>
                                            <TableCell onClick={() => handleClick(employeeDetail.ID)}>{employeeDetail.Department}</TableCell>
                                            <TableCell onClick={() => handleClick(employeeDetail.ID)}>{employeeDetail.Status}</TableCell>
                                            {showActionButton ? <TableCell className={employeeDetail.Status == 'Canceled' ? 'disableRevoke' : ''}><a className="link" onClick={() => openConfirmationDialog(employeeDetail)}>Revoke Clearance</a></TableCell> : null}
                                        </TableRow>
                                    ))}
                                </TableBody> :
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={showActionButton ? 8 : 7} >
                                                {errorMsg ? <div>No Records Found</div> : "No Records Found"}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                }
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, employeeLists.length > 25 && employeeLists.length]}
                                            colSpan={showActionButton ? 8 : 7}
                                            count={employeeLists.length}
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
            </Paper >
        </div>
    );
};

export default ResignationList;