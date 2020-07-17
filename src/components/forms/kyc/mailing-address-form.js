import React, {useEffect, useState} from 'react'
import {get} from 'lodash'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  List,
  TextField,
  Paper,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Checkbox
} from '@material-ui/core'




export default function MailingAddress({investor, errors, handleChange, setInvestor }) {

  const inputs = [
    {tabLabel: 'Street-Address', label: 'Street Address', slug: 'mail_street_address'},
    {tabLabel: 'Mailing-City-State-Zip-Province', label: 'City', slug: 'mail_city'},
    {tabLabel: 'Mailing-City-State-Zip-Province', label: 'State', slug: 'mail_state'},
    {tabLabel: 'Mailing-City-State-Zip-Province', label: 'Zip', slug: 'mail_zip'},
    {tabLabel: 'Mailing-Country', label: 'Country', slug: 'mail_country'}

  ]
    return (
        <>
            <Typography variant="subtitle2">
            Mailing Address is the same as above 
            <Checkbox
              color="primary"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              onChange={(e) => setInvestor(prev => ({...prev, usePermAddressAsMailing: e.target.checked }))}
                          />
                </Typography>
            { !investor.usePermAddressAsMailing && <Grid container spacing={3}>

            {inputs.map(item => {
              return (
                <Grid item xs={12} sm={12} md={6}>
                <TextField required
                            error={errors.includes(item.slug)}
                            style={{width: "100%"}}
                            value={get(investor, item.slug) || ""}
                            onChange={handleChange(item.slug)}
                            label={item.label}
                            variant="outlined"/>
                </Grid>
                )
            })}
          </Grid>}
        </>
    )
}

