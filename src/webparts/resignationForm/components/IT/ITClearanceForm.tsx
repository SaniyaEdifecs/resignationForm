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

const ItClearance = (props) => {
    const classes = useStyles(0);
    let userID = props.props;
    const [isUserExist, setUserExistence] = useState(false);
    const [formView, setView] = useState(false);
    const formFields = [
        "DataBackup", "AccessRemoval", "DataCard", "Laptop_x002f_Desktop", "AccessCard", "IDCard", "PeripheralDevices", "PeripheralDevicesComments0", "AccessCardComments", "AccessRemovalComments", "DataBackupComments", "DataCardComments", "DesktopComments", "IDCardComments"
    ];
    let list = sp.web.lists.getByTitle("ItClearance");
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

    const getEmployeeClearanceDetails = (employeeID) => {
        list.items.getById(employeeID).get().then((detail: any) => {
            setUserExistence(true);
            console.log("\n\n\nemployee Clearance saved details - \n\n\n", detail);
            formFields.forEach(formField => {
                stateSchema[formField].value = detail[formField] + "";
            });
            setState(prevState => ({ ...prevState, stateSchema }));
        });
    }

    useEffect(() => {
        if (userID) {
            getEmployeeClearanceDetails(userID);
        }
    }, []);

    const onSubmitForm = (value) => {
        for (const key in value) {
            value[key] = value[key].value;
        }
        console.log("value", value);
        if (isUserExist) {
            list.items.getById(userID).update(value).then(i => {
                console.log("updated", value);
                // setView(true);
                // setState(stateSchema);
            });
        } else {
                let ID = userID;
                value = { ...value, ID };
                console.log("onsubmit", value);
                list.items.add(value).then((response: ItemAddResult): void => {
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
    }

    const { state, setState, disable, saveForm, handleOnChange, handleOnBlur, handleOnSubmit } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm,

    );

    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };
    return (
        <div>
            {
                formView ?<Paper className={classes.root}>
                        <Typography variant="h5" component="h3">
                            Clearance submitted
                         </Typography>
                    </Paper> : <div>
                        {/* <p><Link to="/itClearanceDashboard">Dashboard</Link></p> */}
                        <Typography variant="h5" component="h5">
                            IT Clearance
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
                                        <td>Mailbox and important data back-up</td>
                                        <td>
                                            <TextField margin="normal" name="DataBackup" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataBackup.value} />
                                            {state.DataBackup.error && <p style={errorStyle}>{state.DataBackup.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" name="DataBackupComments" required value={state.DataBackupComments.value} onBlur={handleOnBlur} onChange={handleOnChange} />
                                            {state.DataBackupComments.error && <p style={errorStyle}>{state.DataBackupComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Access Removal (Email, User Account, All applications)</td>
                                        <td>
                                            <TextField margin="normal" name="AccessRemoval" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.AccessRemoval.value} />
                                            {state.AccessRemoval.error && <p style={errorStyle}>{state.AccessRemoval.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" name="AccessRemovalComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.AccessRemovalComments.value} />
                                            {state.AccessRemovalComments.error && <p style={errorStyle}>{state.AccessRemovalComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Phone & SIM/Data card</td>
                                        <td>
                                            <TextField margin="normal" name="DataCard" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataCard.value} />
                                            {state.DataCard.error && <p style={errorStyle}>{state.DataCard.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" name="DataCardComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataCardComments.value} />
                                            {state.DataCardComments.error && <p style={errorStyle}>{state.DataCardComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Laptop/Desktop/Dock Station</td>
                                        <td>
                                            <TextField margin="normal" name="Laptop_x002f_Desktop" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.Laptop_x002f_Desktop.value} />
                                            {state.Laptop_x002f_Desktop.error && <p style={errorStyle}>{state.Laptop_x002f_Desktop.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" name="DesktopComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DesktopComments.value} />
                                            {state.DesktopComments.error && <p style={errorStyle}>{state.DesktopComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Access Card</td>
                                        <td>
                                            <TextField margin="normal" name="AccessCard" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.AccessCard.value} />
                                            {state.AccessCard.error && <p style={errorStyle}>{state.AccessCard.error}</p>}</td>
                                        <td>
                                            <TextField margin="normal" required onBlur={handleOnBlur} onChange={handleOnChange} name="AccessCardComments" value={state.AccessCardComments.value} />
                                            {state.AccessCardComments.error && <p style={errorStyle}>{state.AccessCardComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ID Card</td>
                                        <td>
                                            <TextField margin="normal" name="IDCard" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.IDCard.value} />
                                            {state.IDCard.error && <p style={errorStyle}>{state.IDCard.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" required onBlur={handleOnBlur} onChange={handleOnChange} name="IDCardComments" value={state.IDCardComments.value} />
                                            {state.IDCardComments.error && <p style={errorStyle}>{state.IDCardComments.error}</p>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Others- Chargers, mouse, headphones etc</td>
                                        <td>
                                            <TextField margin="normal" name="PeripheralDevices" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.PeripheralDevices.value} />
                                            {state.PeripheralDevices.error && <p style={errorStyle}>{state.PeripheralDevices.error}</p>}
                                        </td>
                                        <td>
                                            <TextField margin="normal" required onBlur={handleOnBlur} onChange={handleOnChange} name="PeripheralDevicesComments0" value={state.PeripheralDevicesComments0.value} />
                                            {state.PeripheralDevicesComments0.error && <p style={errorStyle}>{state.PeripheralDevicesComments0.error}</p>}
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
}

export default ItClearance;