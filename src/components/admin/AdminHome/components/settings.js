import React, { useState, useEffect } from 'react'
import {
    Paper,
    Grid,
    Typography,
    Button,
    TextField
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom"
import { useMutation } from '@apollo/react-hooks'
import { toLower, get, pick } from 'lodash'
import { gql } from 'apollo-boost'
import POSModal from './pos-modal'


const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
    },
    divider: {
        margin: "16px -16px"
    },
    tabs: {
        borderTop: "1px solid #dfe3e9",
        borderBottom: "1px solid #dfe3e9",
        background: "#f7f9fa",
        minHeight: 44,
        margin: "40px 0",
    },
    text: {
        color: "#7f8ea3"
    },
    tab: {
        height: 42,
        width: "100%"
    },
    subtitle: {
        color: "#3A506B",
        marginTop: 16
    },
    activeTab: {
        height: 42,
        paddingTop: 3,
        width: "100%",
        borderBottom: "3px solid #205DF5",
        outline: "0 !important",
    },
    button: {
        margin: ".5rem"
    },
    orgName: {
        color: '#3A506B',
        fontWeight: 'bolder'
    }
}));

const UPDATE_ORG = gql`
  mutation UpdateOrganization($organization: OrganizationInput!) {
    updateOrganization(organization: $organization) {
      _id
      name
      slug
    }
  }
`
function Settings({ investor, orgData, refetch }) {
    const classes = useStyles();
    const history = useHistory()
    const [organization, setOrganization] = useState(null)
    const [modal, setModal] = useState(false)
    const [updateOrganization, { data }] = useMutation(UPDATE_ORG)

    useEffect(() => {
        if (orgData) {
            setOrganization(pick(orgData, ['name', '_id', 'slug']))
        }
    }, [orgData])
    useEffect(() => {
        console.log(data)
        if (data?.updateOrganization?.slug) {
            history.push(`/admin/${data?.updateOrganization?.slug}`)
        }
    }, [data])



    const handleChange = (prop) => e => {
        e.persist()
        if (prop === "investor_type") {
            return setOrganization(prev => ({ ...prev, [prop]: e.target.value, accredited_investor_status: "" }))
        } else {
            return setOrganization(prev => ({ ...prev, [prop]: e.target.value }))
        }
    }
    const docs = investor.documents ? investor.documents : [];
    const hasDoc = docs.find(d => toLower(d.documentName).includes(toLower('Provision')))
    return <>
        <Paper className={classes.paper} style={{ marginBottom: 16 }}>
            <Grid container spacing={3}>
                <Grid item sm={12} md={6}>
                    <form noValidate autoComplete="off" style={{ padding: "16px" }}>
                        <Typography variant="subtitle2" style={{ marginBottom: "16px" }}>
                            This information can be edited from your organization settings page.
          </Typography>
                        <Grid container spacing={3} style={{ marginTop: "16px" }}>

                            <Grid item xs={12} sm={12} md={6}>
                                <TextField required
                                    style={{ width: "100%" }}
                                    value={get(organization, 'name') || ""}
                                    onChange={handleChange("name")}
                                    label="Organization Name"
                                    variant="outlined" />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6}>
                                <TextField required
                                    style={{ width: "100%" }}
                                    value={get(organization, 'slug') || ""}
                                    onChange={handleChange("slug")}
                                    label="Organization Slug (URL)"
                                    variant="outlined" />
                            </Grid>

                        </Grid>

                        <Button variant="contained" style={{ marginTop: 16 }}
                            onClick={() => updateOrganization({
                                variables: { organization }
                            })}
                            color="primary">
                            Submit
            </Button>
                    </form>
                </Grid>
                <Grid item sm={12} md={6}>
                    <Typography variant="h6" style={{ marginBottom: "16px" }} onClick={() => setModal(true)}>
                        Provision Of Service
                     </Typography>
                    <POSModal modal={modal} setModal={setModal} organization={organization} />
                </Grid>
            </Grid>
        </Paper>
    </>;
}

export default Settings
