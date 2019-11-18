import * as React from 'react';
import { Typography, TextField, Button, MenuItem, FormControl, Select, FormControlLabel, Checkbox } from '@material-ui/core';
import { sp, ItemAddResult, Item } from '@pnp/sp';
import { useEffect, useState } from 'react';
import useForm from '../UseForm';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../CommonStyleSheet.scss';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3, 2),
        },
    }),
);
const SalesForceClearance = (props) => {
    let ID = props.props;
    let detail: any;
    let list = sp.web.lists.getByTitle("SalesForceClearance");
    const [isUserExist, setUserExistence] = useState(false);
    const [hideButton, setButtonVisibility] = useState();
    const [isdisable, setDisable] = useState(false);
    const [loader, showLoader] = useState(false);
    const options = ['Yes', 'No', 'NA'];
    const formFields = ["LicenseTermination", "LicenseTerminationComment"];
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
        showLoader(true);
        for (const key in value) {
            value[key] = value[key].value;
        }
        value = { ...value, 'Status': status };
        if (isUserExist) {
            list.items.getById(ID).update(value).then(i => {
                showLoader(false);
                getEmployeeClearanceDetails(ID);
            }, (error: any): void => {
                console.log('Error while creating the item: ' + error);
            });
        } else {
            value = { ...value, ID };
            list.items.add(value).then((response: ItemAddResult): void => {
                const item = response.data as string;
                if (item) {
                    showLoader(false);
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
    const getStatusdetails = (status) => {
        switch (status) {
            case "null":
                setButtonVisibility(true);
                setStatus("Pending");
                break;
            case "Pending":
                setButtonVisibility(true);
                break;
            case "Approved":
                setDisable(true);
                break;
            default:
                setButtonVisibility(false);
                break;
        }
    };

    const getEmployeeClearanceDetails = (employeeID) => {
        list.items.getById(employeeID).get().then((response: any) => {
            detail = response;
            getStatusdetails(detail.Status);
            setUserExistence(true);
            formFields.forEach(formField => {
                if (detail[formField] == null) {
                    stateSchema[formField].value = "";
                } else {
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
            {loader ? <div className="loaderWrapper"><CircularProgress /></div> : null}
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
                            <td>
                                <FormControl>
                                    <Select value={state.LicenseTermination.value} disabled={isdisable} id="LicenseTermination" onBlur={handleOnBlur} onChange={handleOnChange} name="LicenseTermination"  >
                                        {options.map((option) => <MenuItem value={option}>{option}</MenuItem>)}
                                    </Select>
                                    {state.LicenseTermination.error && <p style={errorStyle}>{state.LicenseTermination.error}</p>}
                                </FormControl>
                            </td>
                            <td><TextField margin="normal" disabled={isdisable} name="LicenseTerminationComment" required onChange={handleOnChange} onBlur={handleOnBlur} value={state.LicenseTerminationComment.value} />
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