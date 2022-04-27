import * as React from 'react';
import { useEffect, useState } from 'react';
import { Theme, Typography, createStyles, Table, TableBody, TableCell, TableHead, TableRow, Paper, TablePagination, Breadcrumbs, Link, makeStyles, useTheme, TableFooter } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { FirstPage, LastPage, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home';
import '../CommonStyleSheet.scss';
import * as strings from 'ResignationFormWebPartStrings';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import SharePointService from '../SharePointServices';
import MUIDataTable from "mui-datatables";

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

const EmployeeDashboard = (props) => {
    const [employeeDetails, setEmployeeDetails] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loader, showLoader] = useState(false);

    const getClearanceList = () => {
        showLoader(true);
        SharePointService.getListByTitle("Employee%20Details").items.orderBy("Created", false).getAll().then((items: any) => {
            showLoader(false);
            if (items) {
                setEmployeeDetails(items);
                // console.log("details ==", items);
            }
        }).catch(err => {
            showLoader(false);
            setErrorMsg("No Records Found");
        });
    };

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
            label: "ID",
            name: "Id",
            sortable: true,
            options: {
                filter: false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div className="h100"  onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Employee Code",
            name: "EmployeeCode",
            sortable: true,
            options: {
                filter: false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div className="h100"  onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Employee Name",
            name: "FirstName",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div onClick={() => handleClick(tableMeta)}>{value +" " +tableMeta.rowData[7]}</div>
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
                    // console.log('lastworking date', tableMeta);
                    return (
                        <div onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Personal Phone",
            name: "PersonalPhone",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    // console.log('lastworking date', tableMeta);
                    return (
                        <div onClick={() => handleClick(tableMeta)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Status",
            name: "Status",
            sortable: true,
            options: {
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div onClick={() => handleClick(tableMeta)}  className={(value == "Pending" || value == "Not Started" ? 'pendingState' : null)}>{value}</div>
                    );
                }
            }
        },
        {
            label: "Last Name",
            name: "LastName",
            sortable: true,
            options: {
               display: false,
            }
        },
    ];
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
        window.location.href = "?component=employeeDetails&resignationId=" + event.rowData[0];
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
            {/* className="formView" */}
            <div className="">
                <Typography variant="h5" component="h5">
                    Employee {strings.Dashboard}
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                        <HomeIcon className={classes.icon} /> {strings.Home}
                    </Link>
                    <Typography color="textPrimary">Employee {strings.Dashboard}</Typography>
                </Breadcrumbs>
         
                <div>
                    {loader ? <div className="msSpinner">
                        <Spinner label="Fetching data, wait..." size={SpinnerSize.large} />
                    </div> :
                        // <Table >
                        //     <TableHead>
                        //         <TableRow>
                        //             <TableCell>ID</TableCell>
                        //             <TableCell >Employee Code</TableCell>
                        //             <TableCell >Employee Name</TableCell>
                        //             <TableCell >Work Email</TableCell>
                        //             <TableCell >Personal Email</TableCell>
                        //             <TableCell >Personal Phone</TableCell>
                        //             <TableCell >Status</TableCell>
                        //         </TableRow>
                        //     </TableHead>
                        //     {employeeDetails.length > 0 ? <TableBody>
                        //         {(rowsPerPage > 0
                        //             ? employeeDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        //             : employeeDetails
                        //         ).map((EmployeeDetail, index) => (
                        //             <TableRow key={EmployeeDetail.Id} onClick={() => handleClick(EmployeeDetail.Id)} className={(EmployeeDetail.Status == "Pending" || EmployeeDetail.Status == "Not Started" ? 'pendingState' : null)}>
                        //                 <TableCell component="th" scope="row">{EmployeeDetail.Id}</TableCell>
                        //                 <TableCell> {EmployeeDetail.EmployeeCode}</TableCell>
                        //                 <TableCell >{EmployeeDetail.FirstName +' '+ EmployeeDetail.LastName}</TableCell>
                        //                 <TableCell >{EmployeeDetail.WorkEmail}</TableCell>
                        //                 <TableCell >{EmployeeDetail.PersonalEmail}</TableCell>
                        //                 <TableCell >{EmployeeDetail.PersonalPhone}</TableCell>
                        //                 <TableCell >{EmployeeDetail.Status}</TableCell>
                        //             </TableRow>
                        //         ))}
                        //     </TableBody> :
                        //         <TableBody>
                        //             <TableRow>
                        //                 <TableCell colSpan={7} >
                        //                     {errorMsg ? <div>No Records Found</div> : "No Records Found"}
                        //                 </TableCell>
                        //             </TableRow>
                        //         </TableBody>
                        //     }
                        //     <TableFooter>
                        //         <TableRow>
                        //             <TablePagination
                        //                 rowsPerPageOptions={[5, 10, 25, employeeDetails.length > 25 && employeeDetails.length]}
                        //                 colSpan={7}
                        //                 count={employeeDetails.length}
                        //                 rowsPerPage={rowsPerPage}
                        //                 page={page}
                        //                 SelectProps={{
                        //                     inputProps: { 'aria-label': 'rows per page' },
                        //                     native: true,
                        //                 }}
                        //                 onChangePage={handleChangePage}
                        //                 onChangeRowsPerPage={handleChangeRowsPerPage}
                        //                 ActionsComponent={TablePaginationActions}
                        //             />
                        //         </TableRow>
                        //     </TableFooter>
                        // </Table>
                        <MUIDataTable
                        title={""}
                        data={employeeDetails}
                        columns={columns}
                        options={options}
                    />
                        }
                </div>
            </div>
        </Paper>
    );
};

export default EmployeeDashboard;