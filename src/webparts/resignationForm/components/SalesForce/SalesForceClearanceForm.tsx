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
const SalesForceClearance = (props) => {
    const classes = useStyles(0);
    let userID = props.props;
    const [isUserExist, setUserExistence] = useState(false);
    const [formView, setView] = useState(false);
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

    

    
    const getEmployeeResignationDetails = (employeeID) => {
        sp.web.lists.getByTitle("SalesForce%20Clearance").items.getById(employeeID).get().then((detail: any) => {
            setUserExistence(true);
            formFields.forEach(formField => {
                stateSchema[formField].value = detail[formField] + "";
            });
            setState(prevState => ({ ...prevState, stateSchema }));
        });
    }

    useEffect(() => {
        if (userID) {
            getEmployeeResignationDetails(userID);
        }
    }, []);


    const onSubmitForm = (value) => {
        for (const key in value) {
            value[key] = value[key].value;
        }
        if (isUserExist) {
            let list = sp.web.lists.getByTitle("SalesForce%20Clearance");
            list.items.getById(userID).update(state).then(i => {
                // setView(true);
                setState(stateSchema);
            });
        } else {
            sp.web.currentUser.get().then((response) => {
                let ID = response.Id;
                value = { ...value, ID };
                console.log("onsubmit", value);

                sp.web.lists.getByTitle("SalesForce%20Clearance").items.add(value).then((response: ItemAddResult): void => {
                    const item = response.data as string;
                    if (item) {
                        console.log('submitted', item);
                        // setView(true);
                        setState(stateSchema);
                    }
                }, (error: any): void => {
                    console.log('Error while creating the item: ' + error);
                });
            });
        }
    }


    const { state, disable, handleOnChange, handleOnBlur, handleOnSubmit, setState, saveForm } = useForm(
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
            {/* <p><Link to="/salesForceDashboard">Dashboard</Link></p> */}
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
                            <td><TextField margin="normal" name="LicenseTermination" autoFocus required onChange={handleOnChange} onBlur={handleOnBlur} value={state.LicenseTermination.value}/>
                                {state.LicenseTermination.error && <p style={errorStyle}>{state.LicenseTermination.error}</p>}</td>
                            <td><TextField margin="normal" name="LicenseTerminationComment" required onChange={handleOnChange} onBlur={handleOnBlur} value={state.LicenseTerminationComment.value} />
                                {state.LicenseTerminationComment.error && <p style={errorStyle}>{state.LicenseTerminationComment.error}</p>}</td>
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
    );
}

export default SalesForceClearance;