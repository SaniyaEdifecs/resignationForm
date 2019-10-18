import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { Link } from 'react-router-dom';
import useForm from '../UseForm';

const ItClearance = (props) => {
        const formFields = [
            "DataBackup", "AccessRemoval", "DataCard", "Laptop_x002f_Desktop", "AccessCard", "IDCard", "PeripheralDevices","peripheralDevicesComments", "AccessCardComments", "AccessRemovalComments", "DataBackupComments", "DataCardComments", "DesktopComments", "IDCardComments", 
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
    
        let userID: any;
        sp.web.currentUser.get().then((response) => {
            userID = response.Id;
            // sp.web.lists.getByTitle("ItClearance").items.getById(userID).get().then((item: any) => {
            //     if (item) {
            //         console.log("savedData", item);
            //         formFields.forEach(formField => {
            //             stateSchema[formField] = {
            //                 value: item[formField],
            //                 error: ""
            //             };
            //         });
            //         console.log("setState",stateSchema);
            //         setState(stateSchema);
            //         console.log("done");
            //     }
            // });
        });
        console.log("calling useForm"); 
        //  Fetch list data
        sp.web.lists.getByTitle("ItClearance").items.get().then((items: any) => {
           console.log("List response", items);
        });

    const onSubmitForm = (value) => {
        for (const key in value) {
            value[key] = value[key].value;
        }
        sp.web.currentUser.get().then((response) => {
            let ID = response.Id;
            value = { ...value, ID };
            console.log("onsubmit", value);

            sp.web.lists.getByTitle("ItClearance").items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    console.log('submitted', item);
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });

        });
    }

    const { state, setState, disable, handleOnChange, handleOnBlur,  handleOnSubmit, saveForm } = useForm(
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
             <Link to="/itClearanceDashboard">Dashboard</Link>  
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
                                <TextField margin="normal" name="DataBackup" required onBlur={handleOnBlur}  onChange={handleOnChange} value={state.DataBackup.value} />
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
                                <TextField margin="normal" name="AccessRemoval" required onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.AccessRemoval.error && <p style={errorStyle}>{state.AccessRemoval.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="AccessRemovalComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.AccessRemovalComments.value}/>
                                {state.AccessRemovalComments.error && <p style={errorStyle}>{state.AccessRemovalComments.error}</p>}
                                </td>
                        </tr>
                        <tr>
                            <td>Phone & SIM/Data card</td>
                            <td>
                                <TextField margin="normal" name="DataCard" required onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.DataCard.error && <p style={errorStyle}>{state.DataCard.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="DataCardComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DataCardComments.value}/>
                                {state.DataCardComments.error && <p style={errorStyle}>{state.DataCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Laptop/Desktop/Dock Station</td>
                            <td>
                                <TextField margin="normal" name="Laptop_x002f_Desktop" required onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.Laptop_x002f_Desktop.error && <p style={errorStyle}>{state.Laptop_x002f_Desktop.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" name="DesktopComments" required onBlur={handleOnBlur} onChange={handleOnChange} value={state.DesktopComments.value}/>
                                {state.DesktopComments.error && <p style={errorStyle}>{state.DesktopComments.error}</p>}    
                            </td>
                        </tr>
                        <tr>
                            <td>Access Card</td>
                            <td>
                                <TextField margin="normal" name="AccessCard" required onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.AccessCard.error && <p style={errorStyle}>{state.AccessCard.error}</p>}</td>
                            <td>
                                <TextField margin="normal" required onBlur={handleOnBlur} onChange={handleOnChange} name="AccessCardComments" value={state.AccessCardComments.value}/>
                                {state.AccessCardComments.error && <p style={errorStyle}>{state.AccessCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>ID Card</td>
                            <td>
                                <TextField margin="normal" name="IDCard" required onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.IDCard.error && <p style={errorStyle}>{state.IDCard.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" required onBlur={handleOnBlur} onChange={handleOnChange} name="IDCardComments" value={state.IDCardComments.value}/>
                                {state.IDCardComments.error && <p style={errorStyle}>{state.IDCardComments.error}</p>}    
                            </td>
                        </tr>
                        <tr>
                            <td>Others- Chargers, mouse, headphones etc</td>
                            <td>
                                <TextField margin="normal" name="PeripheralDevices" required onBlur={handleOnBlur} onChange={handleOnChange} />
                                {state.PeripheralDevices.error && <p style={errorStyle}>{state.PeripheralDevices.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" required onBlur={handleOnBlur} onChange={handleOnChange} name="peripheralDevicesComments" value={state.peripheralDevicesComments.value}/>
                                {state.peripheralDevicesComments.error && <p style={errorStyle}>{state.peripheralDevicesComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={3} >
                                <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button>
                                <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save</Button>
                                <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default ItClearance;