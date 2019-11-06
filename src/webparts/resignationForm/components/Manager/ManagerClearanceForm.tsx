import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useForm from '../UseForm';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import '../CommonStyleSheet.scss';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3, 2),
        },
    }),
);
const ManagerClearance = (props) => {
    const classes = useStyles(0);
    let userID = props.props;
    const [isUserExist, setUserExistence] = useState(false);
    const [formView, setView] = useState(false);
    const formFields = [
        "AccessRemoval", "AccessRemovalComments", "DataBackup", "DataBackupComments", "EmailBackup", "EmailBackupComments", "EmailRe_x002d_routing", "EmailRe_x002d_routingComments", "HandoverComplete", "HandoverCompleteComments", "NoticeWaiver", "NoticeWaiverComments", "OtherComments", "Others_x0028_specify_x0029_",
    ];

    var stateSchema = {
    };

    var validationStateSchema = {};
    formFields.forEach(formField => {
        stateSchema[formField] = {};
        stateSchema[formField].value = "";
        stateSchema[formField].error = "";
        validationStateSchema[formField] = {};
        validationStateSchema[formField].required = true;
        validationStateSchema[formField].validator = {
            regex: '',
            error: ''
        };

    });

    const onSubmitForm = (value) => {
        for (const key in value) {
            value[key] = value[key].value;
        }
        if (isUserExist) {
            let list = sp.web.lists.getByTitle("ManagersClearance");
            list.items.getById(userID).update(state).then(i => {
                // setView(true);
                // setState(stateSchema);
            });
        } else {
            let ID = userID;
            value = { ...value, ID };
            console.log("onsubmit", value);

            sp.web.lists.getByTitle("ManagersClearance").items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    console.log('submitted', item);
                    // setView(true);
                    // setState(stateSchema);
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        }
    };
    const { state, setState, disable, handleOnChange, handleOnBlur, handleOnSubmit, saveForm } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm,
    );

    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };
    const getEmployeeClearanceDetails = (employeeID) => {
        sp.web.lists.getByTitle("ManagersClearance").items.getById(employeeID).get().then((detail: any) => {
            setUserExistence(true);
            formFields.forEach(formField => {
                stateSchema[formField].value = detail[formField] + "";
            });
            setState(prevState => ({ ...prevState, stateSchema }));
        });
    };

    useEffect(() => {
        if (userID) {
            getEmployeeClearanceDetails(userID);
        }
    }, []);






    return (
        <div>
            {
                formView ? <Paper className={classes.root}>
                    <Typography variant="h5" component="h3">
                        Clearance submitted
                         </Typography>
                </Paper> : <div>
                        {/* <p><Link to="/itManagerDashboard:/">Dashboard</Link>  </p> */}
                        <Typography variant="h5" component="h5">
                            Manager Clearance
            </Typography>
                        <form onSubmit={handleOnSubmit} className="clearanceForm">
                            <table cellSpacing="0" cellPadding="0">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>YES/NO/NA</th>
                                        <th>COMMENTS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Handover Complete</td>
                                        <td>
                                            <TextField margin="normal" name="HandoverComplete" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.HandoverComplete.value} />
                                            {state.HandoverComplete.error && <p style={errorStyle}>{state.HandoverComplete.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" name="HandoverCompleteComments" required value={state.HandoverCompleteComments.value} onBlur={handleOnBlur} onChange={handleOnChange} />
                                            {state.HandoverCompleteComments.error && <p style={errorStyle}>{state.HandoverCompleteComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Data Backup</td>
                                        <td>
                                            <TextField margin="normal" name="DataBackup" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataBackup.value} />
                                            {state.DataBackup.error && <p style={errorStyle}>{state.DataBackup.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" name="DataBackupComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataBackupComments.value} />
                                            {state.DataBackupComments.error && <p style={errorStyle}>{state.DataBackupComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Email Backup</td>
                                        <td>
                                            <TextField margin="normal" name="EmailBackup" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.EmailBackup.value} />
                                            {state.EmailBackup.error && <p style={errorStyle}>{state.EmailBackup.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" name="EmailBackupComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.EmailBackupComments.value} />
                                            {state.EmailBackupComments.error && <p style={errorStyle}>{state.EmailBackupComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Notice Waiver(No. of days)</td>
                                        <td>
                                            <TextField margin="normal" name="NoticeWaiver" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.NoticeWaiver.value} />
                                            {state.NoticeWaiver.error && <p style={errorStyle}>{state.NoticeWaiver.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" name="NoticeWaiverComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.NoticeWaiverComments.value} />
                                            {state.NoticeWaiverComments.error && <p style={errorStyle}>{state.NoticeWaiverComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Access Removal(All Applications)</td>
                                        <td>
                                            <TextField margin="normal" name="AccessRemoval" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.AccessRemoval.value} />
                                            {state.AccessRemoval.error && <p style={errorStyle}>{state.AccessRemoval.error}</p>}</td>
                                        <td>
                                            <TextField margin="normal" required onBlur={handleOnBlur} onChange={handleOnChange} name="AccessRemovalComments" value={state.AccessRemovalComments.value} />
                                            {state.AccessRemovalComments.error && <p style={errorStyle}>{state.AccessRemovalComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Email Re-routing</td>
                                        <td>
                                            <TextField margin="normal" name="EmailRe_x002d_routing" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.EmailRe_x002d_routing.value} />
                                            {state.EmailRe_x002d_routing.error && <p style={errorStyle}>{state.EmailRe_x002d_routing.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" required onBlur={handleOnBlur} onChange={handleOnChange} name="EmailRe_x002d_routingComments" value={state.EmailRe_x002d_routingComments.value} />
                                            {state.EmailRe_x002d_routingComments.error && <p style={errorStyle}>{state.EmailRe_x002d_routingComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Others (specify)</td>
                                        <td>
                                            <TextField margin="normal" required onBlur={handleOnBlur} onChange={handleOnChange} name="Others_x0028_specify_x0029_" value={state.Others_x0028_specify_x0029_.value} />
                                            {state.Others_x0028_specify_x0029_.error && <p style={errorStyle}>{state.Others_x0028_specify_x0029_.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" name="OtherComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.OtherComments.value} />
                                            {state.OtherComments.error && <p style={errorStyle}>{state.OtherComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} >
                                            <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button>
                                            {disable == true ? <div className="inlineBlock">
                                                <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save</Button>
                                                <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>
                                            </div> : <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
            }
        </div>
    );
};

export default ManagerClearance;