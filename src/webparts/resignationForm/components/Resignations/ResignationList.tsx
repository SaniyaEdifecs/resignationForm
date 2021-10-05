import * as React from 'react';
import { useEffect, useState } from 'react';
import { withStyles, Theme, Typography, createStyles, Table, TableBody, TableCell, TableHead, TableRow, Paper, TablePagination, Breadcrumbs, Link, makeStyles, useTheme, TableFooter } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home';
import ConfirmationDialog from '../ConfirmationDialog';
import '../CommonStyleSheet.scss';
import * as strings from 'ResignationFormWebPartStrings';
import SharePointService from '../SharePointServices';
import MUIDataTable from "mui-datatables";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import Moment from "react-moment";

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
        SharePointService.getListByTitle("ResignationList").items.orderBy("Created", false).get().then((items: any) => {
            showLoader(false);
            if (items) {
                console.log('resignation=items', items);
                setEmployeeLists(items);
            }
        }).catch(err => {
            showLoader(false);
            setErrorMsg("No Records Found");
        });
    };


    const handleClick = (event) => {
        window.location.href = "?component=resignationDetail&resignationId=" + event.rowData[8];
    };
    const redirectToForm = (event) => {
        window.location.href = "?component=resignationForm&resignationId=" + event;

    }
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

    const getCurrentUserGroups = () => {
        SharePointService.getCurrentUserGroups().then((groupAccess: any) => {
            let isGroupOwner = groupAccess.filter(group => group.Title === "Resignation Group - Owners").length;
            setShowActionButton(isGroupOwner ? true : false);

            return isResignationOwner;
        });
    };
    const handleChildClick = (value: boolean) => {
        // console.log("isCancled",value, openDialog);
        setOpenDialog(false);
        if (value) {
            getResignationList();
        }
    };
    const openConfirmationDialog = (tableMeta) => {
        // console.log('row data ', tableMeta.tableData[tableMeta.rowIndex]);

        setDialogData(tableMeta);
        setOpenDialog(true);
    };

    useEffect(() => {
        getResignationList();
        getCurrentUserGroups();
    }, []);

    const options = {
        filterType: "checkbox",
        responsive: "stacked",
        selectableRows: false,
        viewColumns: true,
        print: false,
        download: false,
        sortOrder: {
            name: "Id",
            direction: "desc",
        },
    };
    const columns = [
        {
            label: "Employee Code",
            name: "EmployeeCode",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    console.log('ev', tableMeta);
                    return (
                        <div className="h100" onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Employee Name",
            name: "EmployeeName",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Work Email",
            name: "WorkEmail",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Personal Email",
            name: "PersonalEmail",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Resignation Reason",
            name: "ResignationReason",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Department",
            name: "Department",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Last Working Date",
            name: "LastWorkingDate",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div onClick={() => handleClick(tableMeta)}><Moment format="DD/MMM/YYYY">{value}</Moment></div>
                    );
                }
            },
        },
        {
            label: "Status",
            name: "Status",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: 'Resignation Form',
            name: "ID",
            sortable: true,
            options: {
                filter: false,
                display: (showActionButton) ? true : false,
                customBodyRender: (value, rowData) => {
                    return (
                        <a className="link" onClick={() => redirectToForm(value)} >Form -{value}</a>
                    );
                },
            }
        },
        {
            label: 'Action',
            name: "Status",
            sortable: true,
            options: {
                filter: false,
                display: (showActionButton) ? true : false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div className={value == 'Canceled' ? 'disableRevoke' : ''}> <a className="link" onClick={() => openConfirmationDialog(tableMeta)} >Revoke Clearance</a></div>
                    );

                },
            },
        }

    ];


    useEffect(() => {
    }, [openDialog]);

    return (
        <div>
            {openDialog === true ? <ConfirmationDialog props={openDialog} content={dialogData} onChildClick={handleChildClick} /> : ''}
            <Paper className="root removeBoxShadow">

                <div className="">
                    <Typography variant="h5" component="h5">
                        Clearance {strings.Dashboard}
                    </Typography>
                    <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                        <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                            <HomeIcon className={classes.icon} /> {strings.Home}
                        </Link>
                        <Typography color="textPrimary">Clearance {strings.Dashboard}</Typography>
                    </Breadcrumbs>
                    <div>
                         {loader ? <div className="msSpinner">
                            <Spinner label="Fetching data, wait..." size={SpinnerSize.large} />
                        </div> :
                           /* <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Employee Code</TableCell>
                                        <TableCell >Employee Name</TableCell>
                                        <TableCell >Work Email</TableCell>
                                        <TableCell >Personal Email</TableCell>
                                        <TableCell >Reason for Resignation</TableCell>
                                        <TableCell >Department</TableCell>
                                        <TableCell >Status</TableCell>
                                        <TableCell >Last Working Date</TableCell>

                                        {showActionButton ? <TableCell>Resignation Form</TableCell> : null}
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
                                            <TableCell onClick={() => handleClick(employeeDetail.ID)}> <Moment format="DD/MM/YYYY">{employeeDetail.LastWorkingDate}</Moment></TableCell>
                                            {showActionButton ? <TableCell >
                                                <a className="link" onClick={() => redirectToForm(employeeDetail.ID)} >Form -{employeeDetail.ID}</a></TableCell>
                                                : null}
                                            {showActionButton ? <TableCell className={employeeDetail.Status == 'Canceled' ? 'disableRevoke' : ''}><a className="link" onClick={() => openConfirmationDialog(employeeDetail)}>Revoke Clearance</a></TableCell> : null}

                                        </TableRow>
                                    ))}
                                </TableBody> :
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={showActionButton ? 9 : 7} >
                                                {errorMsg ? <div>No Records Found</div> : "No Records Found"}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                }
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, employeeLists.length > 25 && employeeLists.length]}
                                            colSpan={showActionButton ? 9 : 7}
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
                            </Table>} */

                        <MUIDataTable
                            title={""}
                            data={employeeLists}
                            columns={columns}
                            options={options}
                        />}
                    </div>
                </div>
            </Paper >
        </div>
    );
};

export default ResignationList;