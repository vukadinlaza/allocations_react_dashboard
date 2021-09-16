import React from 'react';
import Cards from 'react-credit-cards';
import 'react-credit-cards/lib/styles.scss';
import { Grid, TextField, InputAdornment, Button, Paper, Typography } from '@material-ui/core';
import { toast } from 'react-toastify';

export default class extends React.Component {
  state = {
    cvc: '',
    expiry: '',
    focus: '',
    name: '',
    number: '',
  };

  handleInputFocus = (e) => {
    this.setState({ focus: e.target.name });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <>
        <Paper
          style={{
            padding: '1rem',
            margin: '2rem 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">Add your credit card information</Typography>
        </Paper>

        <Paper
          style={{
            padding: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div id="PaymentForm">
            <Grid container>
              <Grid
                item
                xs={6}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Cards
                  cvc={this.state.cvc}
                  expiry={this.state.expiry}
                  focused={this.state.focus}
                  name={this.state.name}
                  number={this.state.number}
                />
              </Grid>
              <Grid item xs={6}>
                <form
                  style={{
                    margin: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={6} spacing={1}>
                      <TextField
                        variant="outlined"
                        style={{ display: 'block', margin: '1rem 0' }}
                        type="tel"
                        name="number"
                        placeholder="Card Number"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />
                      <TextField
                        variant="outlined"
                        style={{ display: 'block', margin: '1rem 0' }}
                        type="tel"
                        name="name"
                        placeholder="Name"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />{' '}
                    </Grid>
                    <Grid item xs={6} spacing={1}>
                      <TextField
                        variant="outlined"
                        style={{ display: 'block', margin: '1rem 0' }}
                        type="tel"
                        name="expiry"
                        placeholder="Expiration"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />
                      <TextField
                        variant="outlined"
                        style={{ display: 'block', margin: '1rem 0' }}
                        type="tel"
                        name="cvc"
                        placeholder="CVC"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: '85%' }}
                    size="large"
                    onClick={() => toast.success('Success! Credit card information saved.')}
                  >
                    Submit
                  </Button>
                </form>{' '}
              </Grid>
            </Grid>
          </div>
        </Paper>
      </>
    );
  }
}
