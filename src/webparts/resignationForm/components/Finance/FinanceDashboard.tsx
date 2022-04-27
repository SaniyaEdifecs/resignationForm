import * as React from 'react';
import { useEffect, useState } from 'react';
import { withStyles, Theme, Typography, createStyles, Table, TableBody, TableCell, TableHead, TableRow, Paper, TablePagination, Breadcrumbs, Link, makeStyles, useTheme, TableFooter } from '@material-ui/core';
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

const FinanceDashboard = (props) => {
    const [employeeDetails, setEmployeeDetails] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    // const [page, setPage] = useState(0);
    // const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loader, showLoader] = useState(false);

    const getClearanceList = () => {
        showLoader(true);
        SharePointService.getListByTitle("Finance%20Clearance").items.select('Id', 'Status', 'EmployeeNameId', 'EmployeeName/EmployeeCode', 'EmployeeName/EmployeeName', 'EmployeeName/ManagerName').expand("EmployeeName").orderBy("Created", false).getAll().then((items: any) => {
            showLoader(false);
            if (items) {
                items = items.map(item => {
                    return {...item,...item.EmployeeName}
                 }); 
                setEmployeeDetails(items);
            }
        }).catch(err =>{
            showLoader(false);
            setErrorMsg("No Records Found");
        });
    };
    useEffect(() => {
        getClearanceList();
    }, []);

  

    const handleClick = (event) => {
        window.location.href = "?component=financeClearance&resignationId=" + event.rowData[0];
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
                    console.log('ev', tableMeta);
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
            label: "Manager Name",
            name: "ManagerName",
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
        }
    ];
    return (
        <Paper className="root removeBoxShadow">
            <div className="">
                <Typography variant="h5" component="h5">
                    Finance {strings.Dashboard}
                </Typography>
                <Breadcrumbs separator="›" aria-label="breadcrumb" className="marginZero">
                    <Link color="inherit" onClick={() => SharePointService.redirectTo(strings.HomeUrl, "")} className={classes.link}>
                        <HomeIcon className={classes.icon} /> {strings.Home}
                    </Link>
                    <Typography color="textPrimary">Finance {strings.Dashboard}</Typography>
                </Breadcrumbs>
                <div >
                {loader ? <div className="msSpinner">
                        <Spinner label="Fetching data, wait..." size={SpinnerSize.large} />
                    </div> :
                    // <Table >
                    //     <TableHead>
                    //         <TableRow>
                    //             <TableCell>ID</TableCell>
                    //             <TableCell >Employee Code</TableCell>
                    //             <TableCell >Employee Name</TableCell>
                    //             <TableCell >Manager name</TableCell>
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
                    //                 <TableCell> {EmployeeDetail.EmployeeName.EmployeeCode}</TableCell>
                    //                 <TableCell >{EmployeeDetail.EmployeeName.EmployeeName}</TableCell>
                    //                 <TableCell >{EmployeeDetail.EmployeeName.ManagerName}</TableCell>
                    //                 <TableCell >{EmployeeDetail.Status}</TableCell>
                    //             </TableRow>
                    //         ))}
                    //     </TableBody> :
                    //         <TableBody>
                    //             <TableRow>
                    //                 <TableCell colSpan={5} >
                    //                     {errorMsg ? <div>No Records Found</div>: "No Records Found"}
                    //                 </TableCell>
                    //             </TableRow>
                    //         </TableBody>
                    //     }
                    //     <TableFooter>
                    //         <TableRow>
                    //             <TablePagination
                    //                 rowsPerPageOptions={[5, 10, 25, employeeDetails.length > 25 && employeeDetails.length]}
                    //                 colSpan={5}
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

export default FinanceDashboard;
