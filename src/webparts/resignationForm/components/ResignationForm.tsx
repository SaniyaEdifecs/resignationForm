import * as React from 'react';
import { useState, useContext } from 'react'
import styles from './ResignationForm.module.scss';
import {Avatar, TextareaAutosize, Button, CssBaseline, TextField, Grid, Typography, Container, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';


// import DateFnsUtils from '@date-io/date-fns';
// import {
//     MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';



const ResignationForm = () => {

  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date('2014-08-18T21:11:54'),
  );

  const [reason, setResignationReason] = useState('0');


  const handleChange = (event) => {
    console.log("evnet", event);
    setResignationReason(event.target.value as string);
  };

  return <div>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div >
        <Avatar >
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Resignation Application
        </Typography>
        <form noValidate>
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Employee Code" name="email" autoComplete="email" autoFocus />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" margin="normal" required fullWidth label="First Name" name="firstName" autoComplete="firstName" autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" name="lastName" autoComplete="lastName" autoFocus />
            </Grid>
          </Grid>
          <TextField variant="outlined" margin="normal" required fullWidth label="Work Email" name="workEmail" autoComplete="workEmail" autoFocus />
          <TextField variant="outlined" margin="normal" required fullWidth  label="Personal Email" name="personalEmail" autoComplete="personalEmail" autoFocus />
          <FormControl className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth">
            <InputLabel htmlFor="reason">Reason for Resignation</InputLabel>
            <Select value={reason}  onChange={handleChange} >
              <MenuItem value={10}>Personal</MenuItem>
              <MenuItem value={20}>Health</MenuItem>
              <MenuItem value={30}>Better Oppertunity</MenuItem>
              <MenuItem value={40}>US Transfer</MenuItem>
              <MenuItem value={50}>RG Transfer</MenuItem>
              <MenuItem value={60}>Higher Education</MenuItem>
              <MenuItem value={70}>Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField variant="outlined" margin="normal" required fullWidth label="Department" name="department" autoFocus />
          <TextField variant="outlined" margin="normal" required fullWidth label="Title" name="title" autoFocus />
          
          {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date picker inline"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        </Grid>
        </MuiPickersUtilsProvider> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
            <TextField variant="outlined" margin="normal" required fullWidth label="First Name" name="managerFirstName" autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" name="managerLastName" autoComplete="lastName" autoFocus />
            </Grid>
          </Grid>
          <TextField variant="outlined" margin="normal" required fullWidth label="Manager Email" name="managerEmail" autoFocus />
          <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Resignation Summary" placeholder="Resignation Summary" multiline margin="normal" variant="outlined" />
    {/* <TextareaAutosize aria-label="minimum height" rows={3} placeholder="Resignation Summary" />;     */}
          <Button type="submit" fullWidth variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </div>
    </Container>
  </div>;
}

export default ResignationForm;