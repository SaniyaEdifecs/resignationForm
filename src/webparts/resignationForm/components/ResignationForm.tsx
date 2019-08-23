import * as React from 'react';
import { useState, useContext } from 'react'
import styles from './ResignationForm.module.scss';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';


const ResignationForm = () => {
  const [count, setCount] = useState(0);
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
          <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus
          />
          <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" autoComplete="current-password" />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign In
          </Button>
        </form>
      </div>

    </Container>
  </div>;
}

export default ResignationForm;