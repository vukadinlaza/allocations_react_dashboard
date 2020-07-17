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




export default function ExtraWNine({investor, errors, handleChange, setInvestor }) {

  const inputs = [
    {tabLabel: 'Exempt-Payee-Code', label: 'Exemption Code', slug: 'exempt_payee_code'},
    {tabLabel: 'Exemption-FATCA-Code', label: 'FATCA Code', slug: 'fatca_code'},

  ]
    return (
        <>
            <Typography variant="subtitle2">
            W-9 Information
                </Typography>
                <Grid container spacing={3}>
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
          </Grid>
        </>
    )
}

