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
  Typography
} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";

import countries from "country-region-data"


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

export default function DocusignKYCEmbeddedForm({setLink}) {
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
        getLink({variables: {investor}})
        console.log('fireed')
    }

    useEffect(() => {
       if(data?.getLink?.redirectUrl && !loading) {
           setLink(data?.getLink?.redirectUrl)
       }
    }, [data, loading, setLink])

    useEffect(() => {
        if(userProfile) {
            setInvestor(userProfile)
        }
    }, [userProfile])


    if (!userProfile.email) return <div><Loader/></div>

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
