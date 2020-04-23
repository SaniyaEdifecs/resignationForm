import * as React from 'react';
import { useState, useEffect } from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { sp } from '@pnp/sp';
import './CommonStyleSheet.scss';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
        },
        closeButton: {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
    });

export interface DialogTitleProps extends WithStyles<typeof styles> {
    id: string;
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const ConfirmationDialog = ({ props, content, onChildClick }) => {
    const [open, setOpen] = useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    const [loader, showLoader] = useState(false);
    const handleClose = (isCanceled) => {
        setOpen(false);
        onChildClick(isCanceled);
    };
    const cancelRevoke = () => {
        setOpen(false);
        onChildClick(false);
    }
    useEffect(() => { setOpen(props); }, [props]);

    const revokeResignation = (isCanceled) => {
        let payload: any = { 'Status': 'Canceled', 'HrStatus': 'Canceled', 'FinanceStatus': 'Canceled', 'ItStatus': 'Canceled', 'ManagerStatus': 'Canceled', 'SalesforceStatus': 'Canceled', 'Operations_x002f_AdminStatus': 'Canceled', 'emplStatus': 'Canceled' };
        showLoader(true);
        sp.web.lists.getByTitle("ResignationList").items.getById(content.ID).update(payload).then(items => {
            if (items) {
                showLoader(false);
                setShowSuccessMsg(true);
                sp.web.lists.getByTitle("ItClearance").items.filter('EmployeeNameId eq ' + content.ID).get().then((ITList: any) => {
                    if (ITList.length) {
                        sp.web.lists.getByTitle("ItClearance").items.getById(ITList[0]['ID']).update({ 'Status': 'Canceled' }).then(items => {
                        });
                    }
                });
                sp.web.lists.getByTitle("ManagersClearance").items.filter('EmployeeNameId eq ' + content.ID).get().then((managerList: any) => {
                    if (managerList.length) {
                        sp.web.lists.getByTitle("ManagersClearance").items.getById(managerList[0]['ID']).update({ 'Status': 'Canceled' }).then(items => {
                        });
                    }
                });
                sp.web.lists.getByTitle("OperationsClearance").items.filter('EmployeeNameId eq ' + content.ID).get().then((opsList: any) => {
                    if (opsList.length) {
                        sp.web.lists.getByTitle("OperationsClearance").items.getById(opsList[0]['ID']).update({ 'Status': 'Canceled' }).then(items => {
                        });
                    }
                });
                sp.web.lists.getByTitle("Finance%20Clearance").items.filter('EmployeeNameId eq ' + content.ID).get().then((financeList: any) => {
                    if (financeList.length) {
                        sp.web.lists.getByTitle("Finance%20Clearance").items.getById(financeList[0]['ID']).update({ 'Status': 'Canceled' }).then(items => {
                        });
                    }
                });
                sp.web.lists.getByTitle("SalesForceClearance").items.filter('EmployeeNameId eq ' + content.ID).get().then((sfList: any) => {
                    if (sfList.length) {
                        sp.web.lists.getByTitle("SalesForceClearance").items.getById(sfList[0]['ID']).update({ 'Status': 'Canceled' }).then(items => {
                        });
                    }
                });
                sp.web.lists.getByTitle("HrClearance").items.filter('EmployeeNameId eq ' + content.ID).get().then((hrList: any) => {
                    if (hrList.length) {
                        sp.web.lists.getByTitle("HrClearance").items.getById(hrList[0]['ID']).update({ 'Status': 'Canceled' }).then(items => {
                        });
                    }
                });
                sp.web.lists.getByTitle("Employee%20Details").items.filter('EmployeeNameId eq ' + content.ID).get().then((employeeList: any) => {
                    if (employeeList.length) {
                        sp.web.lists.getByTitle("Employee%20Details").items.getById(employeeList[0]['ID']).update({ 'Status': 'Canceled' }).then(items => {
                        });
                    }
                });

                setTimeout(() => {
                    handleClose(isCanceled);
                    setOpen(false);
                    setShowSuccessMsg(false);
                }, 5000);
            }

        });
    }


    return (
        <div>
            <Dialog onClose={() => handleClose(false)} aria-labelledby="customized-dialog-title" open={open}>
                {showSuccessMsg ?
                    <DialogTitle id="customized-dialog-title" onClose={() => handleClose(false)}>
                        Clearance revoked successfully!
                </DialogTitle> :
                    <div>
                        <DialogContent >
                            Are you sure to revoke <b>{content.EmployeeName}'s</b> clearance?
                      </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={() => revokeResignation(true)} color="primary" className="descLink">
                                Yes
                             </Button>
                            <Button variant="contained" onClick={cancelRevoke} >
                                No
                             </Button>
                        </DialogActions></div>}
            </Dialog>
        </div >
    );
};
export default ConfirmationDialog;