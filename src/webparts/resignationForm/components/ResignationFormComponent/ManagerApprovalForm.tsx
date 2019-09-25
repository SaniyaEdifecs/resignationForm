import * as React from 'react';
import { Radio, RadioGroup, Button, FormControlLabel, FormControl, FormLabel } from '@material-ui/core/';
import { sp} from '@pnp/sp';
const ManagerApprovalForm = () => {
    const [value, setValue] = React.useState();
    let userDetails: any={};
    const handleChange = event => {
        setValue(event.target.value);
    };
  // current user email id
  sp.web.currentUser.get().then((response) => {
    // console.log("Current user details", response)
    let userId = response.Id;
    // get a specific item by id
    if (userId) {
        sp.web.lists.getByTitle("ResignationList").items.getById(userId).get().then((items: any) => {
            userDetails = items;
           // console.log("get a specific item by id", userDetails);
            // setInputs(userDetails);
            
        });
    }

});
    return (
        <div className="">
            <header>
                Hello
             </header>
            <section>
                This is to inform you that Mr/Mrs XYZ having employee Code #### has submitted a request for resignation from the post of 'Title'. The resignation details provided by the employee are as below:
                <table cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>Reason For resignation</th>
                            <td>{userDetails.ResignationReason}</td>
                        </tr>
                        <tr>
                            <th>Department</th>
                            <td>{userDetails.Title}</td>
                        </tr>
                        <tr>
                            <th>Resignation Date</th>
                            <td>{userDetails.Created}</td>
                        </tr>
                        <tr>
                            <th>Resignation Details</th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Personal Email</th>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
                <p>Please have a conversation with the associate and guide for the next step.</p>
                <form>
                    <FormControl component="fieldset" >
                        <RadioGroup aria-label="gender" name="gender2" value={value} onChange={handleChange}>
                            <FormControlLabel
                                value="Accept"
                                control={<Radio color="primary" />}
                                label="Accept"
                                labelPlacement="start"
                            />
                            <FormControlLabel
                                value="Reject"
                                control={<Radio color="primary" />}
                                label="Reject"
                                labelPlacement="start"
                            />
                            <FormControlLabel
                                value="other"
                                control={<Radio color="primary" />}
                                label="I want to put the Resignation On Hold"
                                labelPlacement="start"
                            />
                        </RadioGroup>
                    </FormControl>
                    <Button type="submit" fullWidth className="marginTop16" variant="contained" color="primary">Submit</Button>
                </form>
            </section>
        </div>);

};

export default ManagerApprovalForm;