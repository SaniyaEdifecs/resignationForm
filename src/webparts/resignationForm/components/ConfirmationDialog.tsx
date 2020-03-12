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
    console.log('dialog', content);
    const revokeResignation = () => {
        let payload: any = { 'Status': 'Canceled', 'HrStatus': 'Canceled', 'FinanceStatus': 'Canceled', 'ItStatus': 'Canceled', 'ManagerStatus': 'Canceled', 'SalesforceStatus': 'Canceled', 'Operations_x002f_AdminStatus':'Canceled' }
        sp.web.lists.getByTitle("ResignationList").items.getById(content.ID).update(payload).then(items => {
            if (items) {
                console.log(items);
                handleClose();
                window.location.reload();
            }

        });
    }

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        onChildClick(false);
    };
    useEffect(() => {
        setOpen(props);
    }, [props]);

    return (
        <div>
            <Dialog aria-labelledby="customized-dialog-title" open={open}>
                {/* <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {ReactHtmlParser(content.mrTITLE && content.mrTITLE)}
                </DialogTitle> */}
                <DialogContent >
                        Are you sure to revoke <b>{content.Title}'s</b> resignation?
                </DialogContent>
                <DialogActions>
                    <Button  onClick={revokeResignation} color="primary" className="descLink">
                        Yes
                    </Button>
                    <Button  onClick={handleClose} color="secondary" className="descLink">
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default ConfirmationDialog;