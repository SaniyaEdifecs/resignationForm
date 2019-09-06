import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import styles from './ResignationForm.module.scss';
import { Button, CssBaseline, TextField, Grid, Typography, Container, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { sp, Item, ItemAddResult, } from '@pnp/sp';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useForm = ({ initialValues, onSubmit, validate }) => {
  const [inputs, setInputs] = useState(initialValues || {});
  const [LastWorkingDate, setDate] = useState(new Date());
  const [touchedValues, setTouchedValues] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const handleInputChange = event => {
    const target = event.target;
    const name = target.name;
    setInputs(inputs => ({ ...inputs, [name]: target.value }));
  };
  const clearState = () => {
    setInputs({ ...initialValues });
  };
  const handleDateChange = event => {
    console.log(event);
    setDate(event);
  }
  const handleBlur = event => {
    const target = event.target;
    const name = target.name;
    setTouchedValues({ ...touchedValues, [name]: true });
    const e = validate(inputs);
    setErrors({ ...errors, ...e });
  };


  const submitResignation = event => {
    event.preventDefault();
    const e = validate(inputs);
    setErrors({
      ...errors,
      ...e
    });
    onSubmit({ inputs, e, LastWorkingDate });
    clearState();
  };

  return {
    inputs,
    touchedValues,
    errors,
    handleDateChange,
    LastWorkingDate,
    handleInputChange,
    submitResignation,
    handleBlur,
  
  };
};

const ResignationForm = () => {
  const resignationReasonList = ['Personal', 'Health', 'Better Oppertunity', 'US Transfer', 'RG Transfer', 'Higher Education', 'Other'];
  const {
    inputs,
    touchedValues,
    errors,
    handleDateChange,
    handleInputChange,
    submitResignation,
    handleBlur,
    LastWorkingDate
    } = useForm({
    initialValues: {
      EmployeeCode: "",
      FirstName: "",
      LastName: "",
      WorkEmail: "",
      PersonalEmail: "",
      ResignationReason: "",
      OtherReason: "",
      Department: "",
      JobTitle: "",
      managerFirstName: "",
      managerLastName: "",
      ManagerEmail: "",
      ResignationSummary: "",

    },
    onSubmit(inputs, LastWorkingDate, errors, reset ) {
      let employeeDetails = inputs.inputs;
      const elements = [{
        'Title': employeeDetails.FirstName,
        'Department': employeeDetails.Department,
        'EmployeeCode': employeeDetails.EmployeeCode,
        'FirstName': employeeDetails.FirstName,
        'LastName': employeeDetails.LastName,
        'EmployeeName': employeeDetails.FirstName + " " + employeeDetails.LastName,
        'JobTitle': employeeDetails.JobTitle,
        'WorkEmail': employeeDetails.WorkEmail,
        'PersonalEmail': employeeDetails.PersonalEmail,
        'ManagerEmail': employeeDetails.ManagerEmail,
        'ResignationReason': employeeDetails.ManagerEmail,
        'OtherReason': employeeDetails.OtherReason,
        'ResignationSummary': employeeDetails.ResignationSummary,
        // 'LastWorkingDate': inputs.LastWorkingDate
      }]
      console.log("value---------", inputs);
      addListItem(elements[0]);
    },
    validate(inputs) {
      const errors = {};

      if (inputs.name === "") {
        // errors.name = "Please enter a name";
      }

      return errors;
    }
  });
  const addListItem = (elements) => {
    sp.web.lists.getByTitle("ResignationList").items.add(elements).then((response: ItemAddResult): void => {
      const item = response.data as string;
      if(item){
      }
    }, (error: any): void => {
      console.log('Error while creating the item: ' + error);
    });
  };


    return <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div>
          <Typography component="h1" variant="h5">
            Resignation Application
          </Typography>
          <Typography component="h3" className={styles.marginVertical16}>
            Employee Details
          </Typography>
          <form noValidate onSubmit={submitResignation}>
            <TextField variant="outlined" margin="normal" required fullWidth label="Employee Code" value={inputs.EmployeeCode} name="EmployeeCode" autoComplete="EmployeeCode" autoFocus onChange={handleInputChange} helperText="Please write code as written on play slip" />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField variant="outlined" margin="normal" required fullWidth label="First Name" value={inputs.FirstName} onChange={handleInputChange} name="FirstName" autoComplete="FirstName" autoFocus />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" value={inputs.LastName} name="LastName" autoComplete="LastName" autoFocus onChange={handleInputChange} />
              </Grid>
            </Grid>
            <TextField variant="outlined" margin="normal" required fullWidth label="Work Email" value={inputs.WorkEmail} name="WorkEmail" autoComplete="WorkEmail" autoFocus onChange={handleInputChange} />
            <TextField variant="outlined" margin="normal" required fullWidth label="Personal Email" value={inputs.PersonalEmail} name="PersonalEmail" autoComplete="personalEmail" autoFocus onChange={handleInputChange} />

            <FormControl className="MuiFormControl-fullWidth MuiFormControl-marginNormal">
              <InputLabel htmlFor="reason">Reason for Resignation</InputLabel>
              <Select value={inputs.ResignationReason} onChange={handleInputChange} name="ResignationReason">
                {resignationReasonList.map((list, index) => <MenuItem key={index} value={list}>{list}</MenuItem>)}
              </Select>
            </FormControl>



            <TextField variant="outlined" margin="normal" required fullWidth label="Specify(If other is selected)" value={inputs.OtherReason} name="OtherReason" autoFocus onChange={handleInputChange} />

            <TextField variant="outlined" margin="normal" required fullWidth label="Department" value={inputs.Department} name="Department" autoFocus onChange={handleInputChange} />

            <TextField variant="outlined" margin="normal" required fullWidth label="Title" value={inputs.JobTitle} name="JobTitle" autoFocus onChange={handleInputChange} />

            <MuiPickersUtilsProvider utils={DateFnsUtils} >
              <DatePicker label="Last Working Date" format="MM-dd-yyyy" value={LastWorkingDate} name="LastWorkingDate" required onChange={handleDateChange} />
            </MuiPickersUtilsProvider>
            <Grid container spacing={2}>
              <Grid item sm={12}><InputLabel>Manager Name</InputLabel></Grid>
              <Grid item xs={12} sm={6}>
                <TextField variant="outlined" margin="normal" required fullWidth label="First Name" value={inputs.managerFirstName} name="managerFirstName" autoFocus onChange={handleInputChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" value={inputs.managerLastName} name="managerLastName" autoComplete="lastName" autoFocus onChange={handleInputChange} />
              </Grid>
            </Grid>

            <TextField variant="outlined" margin="normal" required fullWidth label="Manager Email" value={inputs.ManagerEmail} name="ManagerEmail" autoFocus onChange={handleInputChange} />

            <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Resignation Summary" name="ResignationSummary" value={inputs.ResignationSummary} placeholder="Resignation Summary" multiline margin="normal" variant="outlined" onChange={handleInputChange} />

            <Button type="submit" fullWidth variant="contained" color="primary">Submit</Button>
          </form>
        </div>
      </Container>
    </div>;
  }


export default ResignationForm;