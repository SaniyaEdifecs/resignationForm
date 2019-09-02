import * as React from 'react';
import { useState, useContext, useEffect } from 'react'
import styles from './ResignationForm.module.scss';
import { Avatar, TextareaAutosize, Button, CssBaseline, TextField, Grid, Typography, Container, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { sp, ItemAddResult } from '@pnp/sp'
import { any } from 'prop-types';


// import DateFnsUtils from '@date-io/date-fns';
// import {
//     MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';

const ResignationForm = () => {
  const resignationReasonList = ['Personal', 'Health', 'Better Oppertunity', 'US Transfer', 'RG Transfer', 'Higher Education', 'Other'];
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(),
  );

  const [reason, setResignationReason] = useState('Personal');
  const [inputs, setInputs] = useState({
    EmployeeCode: "",
    FirstName: "",
    LastName: "",
    ResignationReason: "",
    ManagerEmail: "",
    managerFirstName: "",
    managerLastName: "",
    JobTitle: "",
    Department: "",
    PersonalEmail: "",
    WorkEmail: "",
  });


  const handleChange = (event) => {
    console.log("evnet", event);
    setResignationReason(event.target.value);
  };

  const handleInputChange = (event) => {
    event.persist();
    console.log(event);
    setInputs(inputs => ({ ...inputs, [event.target.name]: event.target.value }));
  }

  // Form Submission
  const submitResignation = (inputs) => {
    if (event) {
      event.preventDefault();
    }
    console.log(inputs)
  //  const response = inputs.target
  //  response.forEach(element => {
  //     console.log(element.name, element.value)
  //   });
    // sp.web.lists.getByTitle("ResignationList").items.add({
    //   Title: "Zia",
    //   Department: "Hosting",
    //   EmployeeCode: "122",
    //   EmployeeName: "Zia Fatima",
    //   FirstName: "Zia",
    //   LastName: "Fatima",
    //   JobTitle : "Hosting Team",
    //   WorkEmail: "zia.fatima@edifecs.com",
    //   PersonalEmail: "zia@gmail.com",
    //   ManagerEmail: "vineet.sood@edifecs.com",
    //   ResignationReason: "Personal",
    //   OtherReason: "Personal",
    //   ResignationSummary: "Resigning from this post for better oppertunities."


    // }).then((response: ItemAddResult) => {
    //   console.log(response);
    //   return;
    // });
  
  }

  // useEffect(() => {
  //   // Update the document title using the browser API
  //   const title = `You clicked  times`;
  //   console.log(title);
  // });
  return <div>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div >
        {/* <Avatar >
            <LockOutlinedIcon />
          </Avatar> */}
        <Typography component="h1" variant="h5">
          Resignation Application
          </Typography>
        <form noValidate onSubmit={submitResignation}>
          <TextField variant="outlined" margin="normal" required fullWidth label="Employee Code" value={inputs.EmployeeCode} name="EmployeeCode" autoComplete="EmployeeCode" autoFocus onChange={handleInputChange} />
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
            <Select value={reason} onChange={handleChange} name="ResignationReason">
              {resignationReasonList.map((list, index) => <MenuItem key={index} value={list}>{list}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField variant="outlined" margin="normal" required fullWidth label="Department" value={inputs.Department} name="Department" autoFocus onChange={handleInputChange} />
          <TextField variant="outlined" margin="normal" required fullWidth label="Title" value={inputs.JobTitle} name="JobTitle" autoFocus onChange={handleInputChange} />

          {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker disableToolbar variant="inline" format="MM/dd/yyyy" margin="normal" id="date-picker-inline" label="Date picker inline" value={selectedDate} onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </Grid>
        </MuiPickersUtilsProvider> */}
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
          <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Resignation Summary" name="ResignationReason" value={inputs.ResignationReason} placeholder="Resignation Summary" multiline margin="normal" variant="outlined" onChange={handleInputChange} />
          {/* <TextareaAutosize aria-label="minimum height" rows={3} placeholder="Resignation Summary" />;*/}
          <Button type="submit" fullWidth variant="contained" color="primary">
            Submit
            </Button>
        </form>
      </div>
    </Container>
  </div>;
}


export default ResignationForm;