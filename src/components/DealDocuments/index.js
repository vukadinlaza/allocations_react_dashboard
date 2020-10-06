import React, { useEffect, useState } from 'react'
import Loader from '../utils/Loader'
import { gql } from 'apollo-boost'
import { pick, map } from 'lodash'
import { useMutation, useQuery } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import {
    Button,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';


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
      organizations_admin {
        _id
        deals {
            _id
            company_name
        }
      }
    }
  }
`

const ADD_DOCS = gql`
    mutation AddDealDocs($deal_id: String!, $docs: Upload) {
        addDealDocs(deal_id: $deal_id, docs: $docs) {
            _id
        }
    }
`


const ADD_DOC = gql`
      mutation AddDealDoc($deal_id: String!, $title: String!, $doc: Upload!) {
      addDealDoc(deal_id: $deal_id, title: $title, doc: $doc) {
      _id
    }
    }
      `


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


function DealDocuments({ }) {
    const [docs, setDocs] = useState([])
    const [deal, setDeal] = useState()
    const { data: userData } = useQuery(GET_INVESTOR)
    const [addDoc, { data, error }] = useMutation(ADD_DOC)
    const classes = useStyles()
    const submit = async () => {
        const d = await map(docs, doc => {
            return addDoc({
                variables: {
                    deal_id: deal._id, title: doc.name, doc: doc
                }
            })
        })
        console.log(d)
    }
    if (!userData?.investor) return null
    const deals = userData?.investor?.organizations_admin.reduce((acc, org) => {
        return [...acc, ...org.deals]
    }, [])
    return (
        <>
            <Grid item xs={12}>
                <Typography variant="body2">
                    Supplemental files
          </Typography>
            </Grid>
            <Grid>
                <FormControl variant="filled" className={classes.formControl}>
                    <InputLabel id="demo-simple-select-filled-label">Deal</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={'asdasdasd'}
                        onChange={(e) => setDeal(e.target.value)}
                    >
                        {(deals || []).map(d => <MenuItem value={d}>{d?.company_name}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
                {!docs.length >= 1 && <Button fullWidth variant="contained" component="label" style={{ height: 39 }}>
                    Attach
            <input type="file"
                        style={{ display: "none" }}
                        accept="application/pdf"
                        multiple
                        onChange={({ target }) => {
                            if (target.validity.valid) setDocs(target.files)

                        }} />
                </Button>}
            </Grid>
            <Grid item xs={12} sm={6}>
                {map(docs, doc => (
                    <Typography variant="h5">{doc.name}</Typography>
                ))}
            </Grid>

            <Grid item xs={12} sm={4}>
                <Button variant="contained"
                    onClick={submit}
                    style={{ height: 39 }}
                    fullWidth
                    color="primary">
                    Upload
          </Button>
            </Grid>
        </>
    )
}

export default DealDocuments