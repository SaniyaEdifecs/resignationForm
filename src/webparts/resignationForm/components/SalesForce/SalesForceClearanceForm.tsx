import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import useForm from '../UseForm';
import { sp, ItemAddResult } from '@pnp/sp';
import { Link } from 'react-router-dom';

const SalesForceClearance = (props) => {
    console.log("SF props", props )
    const formFields = [
        "LicenseTermination", "LicenseTerminationComment"
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
    sp.web.lists.getByTitle("SalesForce%20Clearance").items.get().then((items: any): void => {
        console.log("salesForce items", items)
    }, (error: any): void => {
        console.log('Error while creating the item: ' + error);
    });
    const onSubmitForm = (value) => {
        for (const key in value) {
            value[key] = value[key].value;
        }
        sp.web.currentUser.get().then((response) => {
            let ID = response.Id;
            value = { ...value, ID };
            console.log("onsubmit", value);

            sp.web.lists.getByTitle("SalesForce%20Clearance").items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    console.log('submitted', item);
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });

        });
    }

    const { state, disable, handleOnChange, handleOnBlur, handleOnSubmit } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );
    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };

    return (
        <div>
            <p><Link to="/salesForceDashboard">Dashboard</Link></p>
            <Typography variant="h5" component="h5">
                SalesForce Clearance
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
                            <td>SFDC License Termination: Kiranpreet Kaur</td>
                            <td><TextField margin="normal" name="LicenseTermination" autoFocus required onChange={handleOnChange} onBlur={handleOnBlur} />
                                {state.LicenseTermination.error && <p style={errorStyle}>{state.LicenseTermination.error}</p>}</td>
                            <td><TextField margin="normal" name="LicenseTerminationComment" required onChange={handleOnChange} onBlur={handleOnBlur} />
                                {state.LicenseTerminationComment.error && <p style={errorStyle}>{state.LicenseTerminationComment.error}</p>}</td>
                        </tr>
                        <tr>
                            <td colSpan={3} >
                                <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button>
                                <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

export default SalesForceClearance;