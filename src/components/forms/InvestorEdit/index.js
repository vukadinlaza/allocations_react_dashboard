import React, {useEffect, useState} from 'react'
import Loader from '../../utils/Loader'
import {get} from "lodash"
import {gql} from 'apollo-boost'
import {useMutation} from '@apollo/react-hooks';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CloudDone, HourglassEmpty, CheckCircle} from '@material-ui/icons'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import {Col, Row} from "reactstrap"
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
  MenuItem
} from '@material-ui/core'
import "./style.scss"

import countries from "country-region-data"
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

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

/***
 *
 * Investor edit form that is reusable
 *
 **/

const UPDATE_USER = gql`
  mutation UpdateUser($investor: UserInput!) {
    updateUser(input: $investor) {
      _id
      first_name
      last_name
      country
      entity_name
      investor_type
      signer_full_name
      accredited_investor_status
      email
      passport {
        link
        path
      }
    }
  }
`

const reqs = ['country', 'investor_type', 'signer_full_name', 'accredited_investor_status', 'email']

export function validate(investor) {
  const required = investor.investor_type === "entity"
    ? ['entity_name', ...reqs]
    : ['first_name', 'last_name', ...reqs]
  return required.reduce((acc, attr) => investor[attr] ? acc : [...acc, attr], [])
}

export default function InvestorEditForm({investor, setInvestor, actionText, icon, setFormStatus, noValidate = false}) {
  const classes = useStyles();
  const [errors, setErrors] = useState([])
  const [updateInvestor, updateInvestorRes] = useMutation(UPDATE_USER)

  const handleChange = (prop) => e => {
    e.persist()
    if (prop === "investor_type") {
      return setInvestor(prev => ({...prev, [prop]: e.target.value, accredited_investor_status: ""}))
    } else {
      return setInvestor(prev => ({...prev, [prop]: e.target.value}))
    }
  }

  const submit = () => {
    // don't validate if noValidate flag passed
    if (noValidate) return updateInvestor({variables: {investor}})

    const validation = validate(investor)
    setErrors(validation)
    if (validation.length === 0) {
      updateInvestor({variables: {investor}})
    }
  }

  useEffect(() => {
    if (updateInvestorRes.data) setFormStatus("complete")
    if (updateInvestorRes.loading) setFormStatus("loading")
  }, [updateInvestorRes])

  if (!investor) return <Loader/>

  return (
    <>
      <Paper className={classes.paper}>

        <Typography variant="h6">
          Profile {icon && <FontAwesomeIcon icon={icon} spin={icon === "circle-notch"}/>}
        </Typography>
        <Typography variant="subtitle2">
          This information can be edited from your profile page.
        </Typography>

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

          {investor.investor_type === "entity" && <Grid item xs={12} sm={12} md={6}>
            <AccreditedInvestorStatus investor={investor} handleChange={handleChange} errors={errors}/>
          </Grid>}

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
            <FormControl required disabled error={errors.includes("country")} variant="outlined"
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

        </Grid>

        <Divider className={classes.divider}/>

        <Button variant="contained"
                onClick={submit}
                color="primary">
          {actionText}
        </Button>

      </Paper>

      <Paper className={classes.paper}>

        <Typography variant="h6">
          KYC
        </Typography>
        <Typography variant="subtitle2">
          We require the following documents:
        </Typography>

        <Divider className={classes.divider}/>

        <KYC investor={investor} setInvestor={setInvestor}/>

        <Divider className={classes.divider}/>

        <Button variant="contained"
                onClick={submit}
                color="primary">
          {actionText}
        </Button>

      </Paper>

      {/*
    <form className="form InvestorEditForm" noValidate autoComplete="off">
      <Row>
        <Col sm={{size: 6, offset: 1}}>

        </Col>
      </Row>
      <Row>
        <Col sm={{size: 6, offset: 1}} className="submit-row">

        </Col>
      </Row>
    </form>*/}</>
  )
}

function KYC({investor, setInvestor}) {
  const status = investor.passport && investor.accredidation_doc
    ? investor.is_kyced
      ? <Button variant="contained" size="small" style={{backgroundColor: "#21ce99"}}
                startIcon={<CheckCircle/>}>Approved</Button>
      : <Button variant="contained" size="small" color="secondary" startIcon={<HourglassEmpty/>}>Pending</Button>
    : null

  return (
    <List style={{marginLeft: -16}}>
      <AccredidationUploader investor={investor} setInvestor={setInvestor}/>
      <Divider variant="inset" component="li"/>
      <PassportUploader investor={investor} setInvestor={setInvestor}/>
    </List>
  )
}

function PassportUploader({investor, setInvestor}) {
  if (investor.passport) {
    return (
      <div className="file-uploader">
        <ListItem>
          <ListItemText
            primary="ID for KYC"
            secondary="passport / drivers license"
          />
          <ListItemSecondaryAction>
            <Button variant="outlined" size="small" startIcon={<CloudDone/>}>Uploaded</Button>
          </ListItemSecondaryAction>
        </ListItem>
      </div>
    )
  }

  return (
    <ListItem>
      <ListItemText
        primary="ID for KYC"
        secondary="passport / drivers license"
      />
      <ListItemSecondaryAction>
        <Button startIcon={<CloudUploadIcon/>} variant="outlined" component="label">
          Upload
          <input type="file"
                 style={{display: "none"}}
                 onChange={({target}) => {
                   if (target.validity.valid) setInvestor(prev => ({...prev, passport: target.files[0]}))
                 }}/>
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function AccredidationUploader({investor, setInvestor}) {
  if (investor.accredidation_doc) {
    return (
      <ListItem>
        <ListItemText
          primary="Accredited Investor Certificate"
          secondary="via verifyinvestor.com"
        />
        <ListItemSecondaryAction>
          <Button variant="outlined" size="small" startIcon={<CloudDone/>}>Uploaded</Button>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  return (
    <ListItem>
      <ListItemText
        primary="Accredited Investor Certificate"
        secondary="via verifyinvestor.com"
      />
      <ListItemSecondaryAction>
        <Button startIcon={<CloudUploadIcon/>}
                variant="outlined" component="label">
          Upload
          <input type="file"
                 style={{display: "none"}}
                 onChange={({target}) => {
                   if (target.validity.valid) setInvestor(prev => ({...prev, accredidation_doc: target.files[0]}))
                 }}/>
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
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

const statusOptions = {
  individual: [
    "I have over $5m in net assets, excluding my primary residence",
    "I have over $2m-$5m in net assets, excluding my primary residence",
    "I have over $1m-$2m in net assets, excluding my primary residence",
    "I have had $200K in income (or $300K jointly with my spouse) for the past 2 years and expect the same this year",
    "N.A."
  ],
  entity: [
    "My entity has over $25m in assets",
    "My entity has $5m-$25m in assets",
    "All owners of my entity are qualified purchasers",
    "All owners of my entity are accredited",
    "N.A."
  ]
}

function AccreditedInvestorStatus({investor, handleChange, errors}) {
  const {investor_type} = investor
  if (!investor_type) return null

  return (
    <FormControl required error={errors.includes("accredited_investor_status")} variant="outlined"
                 fullWidth
                 style={{width: "100%"}}>
      <InputLabel htmlFor="outlined-age-native-simple">Accredited Investor Type</InputLabel>
      <Select value={investor.accredited_investor_status || ""}
              onChange={handleChange("accredited_investor_status")}
              inputProps={{name: 'Accredited Investor Status'}}>
        <MenuItem value=""></MenuItem>
        {statusOptions[investor_type].map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
