import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Button, CssBaseline, TextField, Grid, Typography, Container, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import useForm from './UseForm';
import styles from '../ResignationForm.module.scss';
import '../CommonStyleSheet.scss';
import validateFormValues from './ValidateFormValues';
import { sp } from '@pnp/sp';

let initialValues = {
};



const ResignationForm = (props) => {

  const resignationReasonList = ['Personal', 'Health', 'Better Oppertunity', 'US Transfer', 'RG Transfer', 'Higher Education', 'Other'];
  const {
    inputs,
    errors,
    getPeoplePickerItems,
    handleDateChange,
    LastWorkingDate,
    handleInputChange,
    handleSubmit,
    handleBlur,
    isSubmitting, } = useForm(initialValues, validateFormValues);



  return <div>
    <Container component="main" maxWidth="xs">

      <CssBaseline />
      <div>
        <Typography component="h2" className={styles.marginVertical16}>
          Employee Details
          </Typography>

        <form noValidate onSubmit={handleSubmit}>
          {/* defaultValue={userDetails.EmployeeCode} */}
          <TextField variant="outlined" margin="normal" autoFocus required fullWidth label="Employee Code" value={inputs.EmployeeCode || ''} name="EmployeeCode" autoComplete="EmployeeCode" onChange={handleInputChange} onBlur={handleBlur} helperText="Please write code as written on play slip" />
          {errors[inputs.EmployeeCode] && <p className={styles.danger}>{errors[inputs.EmployeeCode]}</p>}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {/* <PeoplePicker context={props.context} ensureUser={true} titleText="First Name" personSelectionLimit={1} showtooltip={true} isRequired={true} disabled={false} selectedItems={_getPeoplePickerItems} showHiddenInUI={false}
                principalTypes={[PrincipalType.User]} resolveDelay={1000} /> */}
              <TextField variant="outlined" margin="normal" onBlur={handleBlur} required fullWidth label="First Name" value={inputs.FirstName || ''} onChange={handleInputChange} name="FirstName" autoComplete="FirstName" />
              {errors[inputs.FirstName] && <p className={styles.danger}>{errors[inputs.FirstName]}</p>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" margin="normal" onBlur={handleBlur} required fullWidth label="Last Name" value={inputs.LastName || ''} name="LastName" autoComplete="LastName" onChange={handleInputChange} />
              {errors[inputs.LastName] && <p className={styles.danger}>{errors[inputs.LastName]}</p>}
            </Grid>
          </Grid>
          <TextField variant="outlined" margin="normal" required fullWidth onBlur={handleBlur} label="Work Email" value={inputs.WorkEmail || ''} name="WorkEmail" autoComplete="WorkEmail" onChange={handleInputChange} />
          {errors[inputs.WorkEmail] && <p className={styles.danger}>{errors[inputs.WorkEmail]}</p>}
          <TextField variant="outlined" margin="normal" required fullWidth onBlur={handleBlur} label="Personal Email" value={inputs.PersonalEmail || ''} name="PersonalEmail" autoComplete="personalEmail" onChange={handleInputChange} />

          <FormControl variant="outlined" className="fullWidth">
            <InputLabel htmlFor="reason">Reason for Resignation</InputLabel>
            <Select value={inputs.ResignationReason} id="reason" onChange={handleInputChange} name="ResignationReason" onBlur={handleBlur} >
              {resignationReasonList.map((list, index) => <MenuItem key={index} value={list}>{list}</MenuItem>)}
            </Select>
          </FormControl>

          <TextField variant="outlined" margin="normal" required fullWidth label="Specify(If other is selected)" value={inputs.OtherReason || ''} name="OtherReason" onChange={handleInputChange} onBlur={handleBlur} />
          <TextField variant="outlined" margin="normal" required fullWidth label="Department" value={inputs.Department || '' } name="Department" onChange={handleInputChange} onBlur={handleBlur} />
          <TextField variant="outlined" margin="normal" required fullWidth label="Title" value={inputs.JobTitle} name="JobTitle" onChange={handleInputChange} onBlur={handleBlur} />

          <MuiPickersUtilsProvider utils={DateFnsUtils} >
            <DatePicker label="Last Working Date" className="fullWidth" format="MM-dd-yyyy" value={LastWorkingDate || ''} name="LastWorkingDate" required onChange={handleDateChange} onBlur={handleBlur} />
          </MuiPickersUtilsProvider>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <PeoplePicker context={props.context} ensureUser={true} titleText="Manager Name" personSelectionLimit={1} showtooltip={true} disabled={false} selectedItems={getPeoplePickerItems} showHiddenInUI={false}
                principalTypes={[PrincipalType.User]} isRequired={true} resolveDelay={1000} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" margin="normal" required fullWidth label="First Name" value={inputs.ManagerFirstName || ''} name="ManagerFirstName" onChange={handleInputChange} onBlur={handleBlur} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" margin="normal" required fullWidth label="Last Name" value={inputs.ManagerLastName || ''} name="ManagerLastName" autoComplete="lastName" onChange={handleInputChange} onBlur={handleBlur} />
            </Grid>
          </Grid>

          <TextField variant="outlined" margin="normal" required fullWidth label="Manager Email" value={inputs.ManagerEmail || ''} name="ManagerEmail" onChange={handleInputChange} onBlur={handleBlur} />

          <TextField id="outlined-textarea" className="MuiFormControl-root MuiTextField-root MuiFormControl-marginNormal MuiFormControl-fullWidth" label="Resignation Summary" name="ResignationSummary" value={inputs.ResignationSummary || ''} placeholder="Resignation Summary" multiline margin="normal" variant="outlined" onChange={handleInputChange} onBlur={handleBlur} />

          <Button type="submit" fullWidth className="marginTop16" variant="contained" disabled={isSubmitting} color="primary">Submit</Button>
        </form>
      </div>
    </Container>
  </div>;
};


export default ResignationForm;