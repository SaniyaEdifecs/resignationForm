import * as React from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
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
    let ID = props.props;
    let detail: any;
    let list = sp.web.lists.getByTitle("SalesForce%20Clearance");
    const [isUserExist, setUserExistence] = useState(false);
    const [hideButton, setButtonVisibility] = useState();
    const formFields = ["LicenseTermination", "LicenseTerminationComment", "Status"];
    var stateSchema = {};
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
        value = { ...value, 'Status': status };
        if (isUserExist) {
            list.items.getById(ID).update(value).then(i => {
                getEmployeeClearanceDetails(ID);
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        } else {
            value = { ...value, ID };
            list.items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    getEmployeeClearanceDetails(ID);
                }
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        }
    };

    const { state, disable, status, setStatus, handleOnChange, handleOnBlur, handleOnSubmit, setState, saveForm } = useForm(
        stateSchema,
        validationStateSchema,
        onSubmitForm
    );
    const errorStyle = {
        color: 'red',
        fontSize: '13px',
        margin: '0',
    };

    const getEmployeeClearanceDetails = (employeeID) => {
        list.items.getById(employeeID).get().then((detail: any) => {
            detail = detail;
            if (detail.Status == null) {
                setButtonVisibility(true);
                setStatus("Pending"); // setting default value if it is null
            } else if (detail.Status == "Pending") {
                setButtonVisibility(true);
            } else {
                setButtonVisibility(false);
            }
            setUserExistence(true);
            formFields.forEach(formField => {
                if(detail[formField] == null){
                    stateSchema[formField].value = "";
                }else{
                    stateSchema[formField].value = detail[formField] + "";
                }
            });
            setState(prevState => ({ ...prevState, stateSchema }));
        }, (error: any): void => {
            setButtonVisibility(true);
            console.log('Error while creating the item: ' + error);
        });
    };

    useEffect(() => {
        if (ID) {
            getEmployeeClearanceDetails(ID);
        }
    }, []);


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
                            <td><TextField margin="normal" name="LicenseTermination" autoFocus required onChange={handleOnChange} onBlur={handleOnBlur} value={state.LicenseTermination.value} />
                                {state.LicenseTermination.error && <p style={errorStyle}>{state.LicenseTermination.error}</p>}</td>
                            <td><TextField margin="normal" name="LicenseTerminationComment" required onChange={handleOnChange} onBlur={handleOnBlur} value={state.LicenseTerminationComment.value} />
                                {state.LicenseTerminationComment.error && <p style={errorStyle}>{state.LicenseTerminationComment.error}</p>}</td>
                        </tr>
                        {hideButton ? <tr>
                            <td colSpan={3} >
                                <Button type="submit" className="marginTop16" variant="contained" color="default">Dues Pending</Button>
                                {disable == true ? <div className="inlineBlock">
                                    <Button type="submit" className="marginTop16" variant="contained" color="secondary" onClick={saveForm}>Save</Button>
                                    <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>
                                </div> : <Button type="submit" className="marginTop16" variant="contained" color="primary" disabled={disable}>Dues Complete</Button>}
                            </td>
                        </tr> : null}
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default SalesForceClearance;