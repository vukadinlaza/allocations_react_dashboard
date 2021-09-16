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
          <div id="PaymentForm" style={{ width: '100%' }}>
            <Grid container lg={12} md={12} sm={6}>
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
                  <Grid container>
                    <Grid item xs={6} lg={8} spacing={1}>
                      <TextField
                        variant="outlined"
                        style={{ display: 'block', margin: '1rem 0' }}
                        type="tel"
                        name="number"
                        value={this.state.number}
                        placeholder="Card Number"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />
                      <TextField
                        variant="outlined"
                        style={{ display: 'block', margin: '1rem 0' }}
                        type="tel"
                        name="name"
                        value={this.state.name}
                        placeholder="Name"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />{' '}
                    </Grid>
                    <Grid item xs={6} lg={3} spacing={1}>
                      <TextField
                        variant="outlined"
                        style={{ display: 'block', margin: '1rem 0' }}
                        type="tel"
                        name="expiry"
                        value={this.state.expiry}
                        placeholder="Expiration"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />
                      <TextField
                        variant="outlined"
                        style={{ display: 'block', margin: '1rem 0' }}
                        type="tel"
                        name="cvc"
                        value={this.state.cvc}
                        placeholder="CVC"
                        onChange={this.handleInputChange}
                        onFocus={this.handleInputFocus}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: '100%' }}
                    size="large"
                    onClick={() => {
                      toast.success('Success! Credit card information saved.');
                      this.setState({
                        cvc: '',
                        expiry: '',
                        focus: '',
                        name: '',
                        number: '',
                      });
                    }}
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
