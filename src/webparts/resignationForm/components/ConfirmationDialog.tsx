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
    const revokeResignation = () => {
        let payload: any = { 'Status': 'Canceled', 'HrStatus': 'Canceled', 'FinanceStatus': 'Canceled', 'ItStatus': 'Canceled', 'ManagerStatus': 'Canceled', 'SalesforceStatus': 'Canceled', 'Operations_x002f_AdminStatus': 'Canceled' };
        sp.web.lists.getByTitle("ResignationList").items.getById(content.ID).update(payload).then(items => {
            if (items) {
                console.log(items);
                setShowSuccessMsg(true);
                // setTimeout(() => { handleClose(); }, 5000);

                // window.location.reload();
            }

        });
    }

    const handleClose = () => {
        setOpen(false);
        onChildClick(false);
    };
    const cancelRevoke = ()=>{
        setOpen(false);
    }
    useEffect(() => { setOpen(props); }, [props]);

    return (
        <div>
            <Dialog aria-labelledby="customized-dialog-title" open={open}>
                {showSuccessMsg ?
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        Clearance revoked successfully!
                </DialogTitle> : <div>
                        <DialogContent >
                            Are you sure to revoke <b>{content.Title}'s</b> clearance?
                      </DialogContent>
                        <DialogActions>
                            <Button  variant="contained" onClick={revokeResignation} color="primary" className="descLink">
                                Yes
                    </Button>
                            <Button variant="contained" onClick={cancelRevoke} >
                                No
                    </Button>
                        </DialogActions></div>}
            </Dialog>
        </div>
    );
};
export default ConfirmationDialog;