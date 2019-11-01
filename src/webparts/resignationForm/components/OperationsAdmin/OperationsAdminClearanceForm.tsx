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

const OperationsAdminClearance = (props) => {
    const classes = useStyles(0);
    let userID = props.props;
    const [isUserExist, setUserExistence] = useState(false);
    const [formView, setView] = useState(false);
    const formFields = [
        "BiometricAccess", "BiometricAccessComments", "KuoniConcurAccess", "KuoniConcurAccessComments", "LibraryBooks", "LibraryBooksComments", "Others", "OthersComments", "PedestalKeys", "PedestalKeysComments", "SimCard", "SimCardComments", "StickerComments", "Stickers", "VisitingCards", "VisitingCardsComments"
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
        sp.web.lists.getByTitle("OperationsClearance").items.getById(employeeID).get().then((detail: any) => {
            setUserExistence(true);
            console.log("isUserExists", isUserExist);
            console.log("\n\n\nemployee Clearance saved details - \n\n\n", detail);
            formFields.forEach(formField => {
                stateSchema[formField].value = detail[formField] + "";
            });
            setState(prevState => ({ ...prevState, stateSchema }));
            console.log("\n\n\nstateSchema - \n\n\n", stateSchema);
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
            console.log("isUserExists", isUserExist);
            let list = sp.web.lists.getByTitle("OperationsClearance");
            list.items.getById(userID).update(state).then(i => {
                // setView(true);
                setState(stateSchema);
            });
        } else {
            sp.web.currentUser.get().then((response) => {
                let ID = response.Id;
                value = { ...value, ID };
                console.log("onsubmit", value);

                sp.web.lists.getByTitle("OperationsClearance").items.add(value).then((response: ItemAddResult): void => {
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

    const { state, disable, setState, saveForm, handleOnChange, handleOnBlur, handleOnSubmit, } = useForm(
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
            {/* <p><Link to="/operationsAdminDashboard">Dashboards</Link></p> */}
            <Typography variant="h5" component="h5">
                Operations Clearance
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
                            <td>Pedestal Keys</td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} required onBlur={handleOnBlur} autoFocus name="PedestalKeys" value={state.PedestalKeys.value} />
                                {state.PedestalKeys.error && <p style={errorStyle}>{state.PedestalKeys.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} required onBlur={handleOnBlur} name="PedestalKeysComments" value={state.PedestalKeysComments.value} />
                                {state.PedestalKeysComments.error && <p style={errorStyle}>{state.PedestalKeysComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Car/Bikes Stickers</td>
                            <td>
                                <TextField margin="normal" name="Stickers" onChange={handleOnChange} required onBlur={handleOnBlur}  value={state.Stickers.value} />
                                {state.Stickers.error && <p style={errorStyle}>{state.Stickers.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} required onBlur={handleOnBlur} name="StickerComments" value={state.StickerComments.value} />
                                {state.StickerComments.error && <p style={errorStyle}>{state.StickerComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Library Books</td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="LibraryBooks" value={state.LibraryBooks.value} />
                                {state.LibraryBooks.error && <p style={errorStyle}>{state.LibraryBooks.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="LibraryBooksComments" value={state.LibraryBooksComments.value} />
                                {state.LibraryBooksComments.error && <p style={errorStyle}>{state.LibraryBooksComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Sim Card</td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="SimCard" value={state.SimCard.value} />
                                {state.SimCard.error && <p style={errorStyle}>{state.SimCard.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="SimCardComments" value={state.SimCardComments.value} />
                                {state.SimCardComments.error && <p style={errorStyle}>{state.SimCardComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Visiting Cards</td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="VisitingCards" value={state.VisitingCards.value} />
                                {state.VisitingCards.error && <p style={errorStyle}>{state.VisitingCards.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="VisitingCardsComments" value={state.VisitingCardsComments.value} />
                                {state.VisitingCardsComments.error && <p style={errorStyle}>{state.VisitingCardsComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Kuoni & Concur Access</td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="KuoniConcurAccess" value={state.KuoniConcurAccess.value} />
                                {state.KuoniConcurAccess.error && <p style={errorStyle}>{state.KuoniConcurAccess.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="KuoniConcurAccessComments" value={state.KuoniConcurAccessComments.value} />
                                {state.KuoniConcurAccessComments.error && <p style={errorStyle}>{state.KuoniConcurAccessComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Biometric Access</td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="BiometricAccess" value={state.BiometricAccess.value} />
                                {state.BiometricAccess.error && <p style={errorStyle}>{state.BiometricAccess.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="BiometricAccessComments" value={state.BiometricAccessComments.value} />
                                {state.BiometricAccessComments.error && <p style={errorStyle}>{state.BiometricAccessComments.error}</p>}
                            </td>
                        </tr>
                        <tr>
                            <td>Others(specify)</td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="Others" value={state.Others.value} />
                                {state.Others.error && <p style={errorStyle}>{state.Others.error}</p>}
                            </td>
                            <td>
                                <TextField margin="normal" onChange={handleOnChange} onBlur={handleOnBlur} required name="OthersComments" value={state.OthersComments.value} />
                                {state.OthersComments.error && <p style={errorStyle}>{state.OthersComments.error}</p>}
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
    );
};

export default OperationsAdminClearance;