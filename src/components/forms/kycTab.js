import React, {useEffect, useState} from 'react'
import Loader from '../utils/Loader'
import {gql} from 'apollo-boost'
import {useLazyQuery} from '@apollo/react-hooks';
import {get} from 'lodash'
import {useAuth} from "../../auth/useAuth";
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
import {makeStyles} from "@material-ui/core/styles";

import countries from "country-region-data"
import MailingAddress from './kyc/mailing-address-form'
import TaxTreaty from './kyc/tax-treaty-form'
import ExtraWNine from './kyc/w9-extra'


 const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    maxWidth: 800,
    marginBottom: theme.spacing(4),
  },
  divider: {
    margin: "16px -16px"
  }
}));

const GET_INVESTOR = gql`
  query GetInvestor($email: String, $_id: String) {
    investor(email: $email, _id: $_id) {
      _id
      first_name
      last_name
      entity_name
      country
      investor_type
      signer_full_name
      accredited_investor_status
      email
      accredidation_doc {
        link
        path
      }
      passport {
        link
        path
      }
    }
  }
`


const GET_DOCUSIGN_FORM = gql`
  query GetDocusignForm($investor: Object!) {
    getLink(input: $investor)
  }
`

const required = ['country', 'investor_type', 'signer_full_name', 'dob', 'street_address' , 'city', 'state', 'zip']
const optional = ['mail_country', 'mail_city', 'mail_zip', 'mail_state', 'mail_street_address']

export default function DocusignKYCEmbeddedForm({setLink, deal_slug, org }) {
    const { userProfile } = useAuth(GET_INVESTOR)
    const [investor, setInvestor] = useState({})
    const [getLink, {loading, data }] = useLazyQuery(GET_DOCUSIGN_FORM)
    const [errors, setErrors] = useState([])
    const classes = useStyles();

    const handleChange = (prop) => e => {
        e.persist()
        if (prop === "investor_type") {
        return setInvestor(prev => ({...prev, [prop]: e.target.value, accredited_investor_status: ""}))
        } else {
        return setInvestor(prev => ({...prev, [prop]: e.target.value}))
        }
    }

    const submit = () => {
      const reqs = investor.country !== 'United States' && !investor.usePermAddressAsMailing  ? [...required, ...optional] : required
      const errors = reqs.reduce((acc, attr) => investor[attr] ? acc : [...acc, attr], [])
      setErrors(errors)

      if(errors.length === 0) {
        investor.activeInvestment = {deal_slug, org};
        getLink({variables: {investor}})
      }
    }

    useEffect(() => {
       if(data?.getLink?.redirectUrl && !loading) {
           setLink(data?.getLink)
       }
    }, [data, loading, setLink])

    useEffect(() => {
        if(userProfile) {
            setInvestor(userProfile)
        }
    }, [userProfile])

    if (!userProfile.email) return <Loader/>

    if(loading) return( <Paper className={classes.paper}>

          <Typography variant="h6">
            Fetching Document!
            </Typography>
        <Loader/>
        </Paper>
     )

    return (
        <>
        <form noValidate autoComplete="off">
            <Paper className={classes.paper}>
            <Typography variant="h6">
            KYC Information
            </Typography>
            <Typography variant="subtitle2">
                This information will only be used to populate your KYC documents.
            </Typography>

            {/* GENERAL INFORMATION */}
            

            <Divider className={classes.divider}/>

            <Grid container spacing={3}>

                  <Grid item xs={12} sm={12} md={6}>
                  <FormControl required error={errors.includes("investor_type")} variant="outlined" style={{width: "100%"}}>
                      <InputLabel>Investor Type</InputLabel>
                      <Select value={investor.investor_type || ""}
                              onChange={handleChange("investor_type")}
                              inputProps={{name: 'Type'}}>
                      <MenuItem value=""></MenuItem>
                      <MenuItem value="individual">Individual</MenuItem>
                      <MenuItem value="entity">Entity</MenuItem>
                      </Select>
                  </FormControl>
                  </Grid>


                  <Grid item xs={12} sm={12} md={6}>
                  <FormControl required error={errors.includes("country")} variant="outlined" style={{width: "100%"}}>
                      <InputLabel>Country of Residence or Place of Business</InputLabel>
                      <Select value={investor.country || ""}
                              onChange={handleChange("country")}
                              inputProps={{name: 'Country'}}>
                      <MenuItem value=""></MenuItem>
                      {countries.map(({countryName}) => (
                          <MenuItem key={countryName} value={countryName}>{countryName}</MenuItem>
                      ))}
                      </Select>
                  </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                  <FormControl required disabled error={errors.includes("email")} variant="outlined"
                              style={{width: "100%"}}>
                      <TextField error={errors.includes("email")}
                              style={{width: "100%"}}
                              value={get(investor, 'email') || ""}
                              onChange={handleChange("email")}
                              label="Email"
                              variant="outlined"/>
                  </FormControl>
                  </Grid>

                  <InvestorName investor={investor} errors={errors} handleChange={handleChange}/>

                  <Grid item xs={12} sm={12} md={6}>
                  <TextField required
                              error={errors.includes("signer_full_name")}
                              style={{width: "100%"}}
                              value={get(investor, 'signer_full_name') || ""}
                              onChange={handleChange("signer_full_name")}
                              label="Full Name of Signer"
                              variant="outlined"/>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                  <TextField 
                              error={errors.includes("ssn_itin")}
                              style={{width: "100%"}}
                              value={get(investor, 'ssn_itin') || ""}
                              onChange={handleChange("ssn_itin")}
                              label="SSN or ITIN (optional)"
                              variant="outlined"/>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                  <TextField 
                              error={errors.includes("foreign_tax_number")}
                              style={{width: "100%"}}
                              value={get(investor, 'foreign_tax_number') || ""}
                              onChange={handleChange("foreign_tax_number")}
                              label="Foreign Tax Number (optional)"
                              variant="outlined"/>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                  <TextField
                              error={errors.includes("dob")}
                              style={{width: "100%"}}
                              value={get(investor, 'dob') || ""}
                              onChange={handleChange("dob")}
                              label="Year Of Birth"
                              variant="outlined"/>
                  </Grid>

                </Grid>


              {/* GENERAL ADDRESS */}
                 <Divider className={classes.divider}/>
                  <Typography variant="subtitle2">
                    Permanent Address
                  </Typography>
                 
                 <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={6}>

                  <TextField required
                              error={errors.includes("street_address")}
                              style={{width: "100%"}}
                              value={get(investor, 'street_address') || ""}
                              onChange={handleChange("street_address")}
                              label="Street Address"
                              variant="outlined"/>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                  <TextField required
                              error={errors.includes("city")}
                              style={{width: "100%"}}
                              value={get(investor, 'city') || ""}
                              onChange={handleChange("city")}
                              label="City"
                              variant="outlined"/>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                  <TextField required
                              error={errors.includes("state")}
                              style={{width: "100%"}}
                              value={get(investor, 'state') || ""}
                              onChange={handleChange("state")}
                              label="State"
                              variant="outlined"/>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField required
                              error={errors.includes("zip")}
                              style={{width: "100%"}}
                              value={get(investor, 'zip') || ""}
                              onChange={handleChange("zip")}
                              label="Zip"
                              variant="outlined"/>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                   <FormControl required error={errors.includes("address_country")} variant="outlined" style={{width: "100%"}}>
                      <InputLabel>Country</InputLabel>
                      <Select value={investor.address_country || ""}
                              onChange={handleChange("address_country")}
                              inputProps={{name: 'address-country'}}>
                      <MenuItem value=""></MenuItem>
                      {countries.map(({countryName}) => (
                          <MenuItem key={countryName} value={countryName}>{countryName}</MenuItem>
                      ))}
                      </Select>
                  </FormControl>
                  </Grid>
            </Grid>

            {/* MAILING */}


           {investor.country !== 'United States' && <>
              <Divider className={classes.divider}/>
               <MailingAddress investor={investor} setInvestor={setInvestor} handleChange={handleChange} errors={errors} /> 
            </>}

      
          <Divider className={classes.divider}/>

            <Button variant="contained"
                    onClick={submit}
                    color="primary">
                Next
            </Button>

            </Paper>
        </form>
        </>
    )
}


function InvestorName({investor, errors, handleChange}) {
  if (investor.investor_type === "entity") {
    return (
      <Grid item xs={12} sm={12} md={6}>
        <TextField required
                   error={errors.includes("entity_name")}
                   style={{width: "100%"}}
                   value={get(investor, 'entity_name') || ""}
                   onChange={handleChange("entity_name")}
                   label="Subscriber Entity Name"
                   variant="outlined"/>
      </Grid>
    )
  } else {
    return (
      <React.Fragment>
        <Grid item xs={12} sm={12} md={6}>
          <TextField required
                     error={errors.includes("first_name")}
                     style={{width: "100%"}}
                     value={get(investor, 'first_name') || ""}
                     onChange={handleChange("first_name")}
                     label="Subscriber First Name"
                     variant="outlined"/>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <TextField required
                     error={errors.includes("last_name")}
                     style={{width: "100%"}}
                     value={get(investor, 'last_name') || ""}
                     onChange={handleChange("last_name")}
                     label="Subscriber Last Name"
                     variant="outlined"/>
        </Grid>
      </React.Fragment>
    )
  }
}
