import * as React from 'react';
import { useState, useContext } from 'react'
import styles from './ResignationForm.module.scss';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import { MenuItem, FormControl, InputLabel } from '@material-ui/core';

const ResignationForm = () => {
  const [values, setValues] = React.useState({
    age: '',
    name: 'hai',
  });
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
          <Grid container >
            <Grid item>
              <TextField variant="outlined" margin="normal" required fullWidth label="First Name" name="firstName" autoComplete="firstName" autoFocus />
            </Grid>
            <Grid item>
              <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Last Name" name="lastName" autoComplete="lastName" autoFocus />
            </Grid>
          </Grid>
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Work Email" name="email" autoComplete="email" autoFocus />
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Personal Email" name="email" autoComplete="email" autoFocus />
          <FormControl >
            <InputLabel htmlFor="age-simple">Reason for Resignation</InputLabel>
            <Select inputProps={{ name: 'age', id: 'age-simple', }} value="Personal" >
              <MenuItem value={10}>Personal</MenuItem>
              <MenuItem value={20}>Health</MenuItem>
              <MenuItem value={30}>Better Oppertunity</MenuItem>
              <MenuItem value={40}>US Transfer</MenuItem>
              <MenuItem value={50}>RG Transfer</MenuItem>
              <MenuItem value={60}>Higher Education</MenuItem>
              <MenuItem value={70}>Other</MenuItem>
            </Select>
          </FormControl>
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Specify(if other is selected)" name="email" autoFocus />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign In
          </Button>
        </form>
      </div>

    </Container>
  </div>;
}

export default ResignationForm;