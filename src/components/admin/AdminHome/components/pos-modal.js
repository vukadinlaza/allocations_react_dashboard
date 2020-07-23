import React, {useState, useEffect} from 'react'
import { get } from 'lodash'
import {useLazyQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost'
import { Modal, Grid, TextField, Typography, Paper, Button } from '@material-ui/core';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    paper: {
        width: 800,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        marginTop: '10vh'
    },
    button: {
        backgroundColor: '#00A0C6'
    }
}));
const GET_DOCUSIGN_FORM = gql`
  query GetDocusignForm($data: Object!) {
    getLink(input: $data)
  }
`



const POSModal = ({modal, setModal, organization}) => {
    const classes = useStyles();
    const [formData, setFormData] = useState({})
    const [getLink, { loading, data }] = useLazyQuery(GET_DOCUSIGN_FORM)

    useEffect(() => {
        if (organization) {
        setFormData({organization_name: organization.name, documentType: 'Provision Of Services'})
        }
    }, [organization])


    const inputs = [
        {tabLabel: 'Organization-Name', label: 'Organization Name', slug: 'organization_name'},
    ]

    const handleChange = (prop) => e => {
        e.persist()
        return setFormData(prev => ({...prev, [prop]: e.target.value}))
    }
    const submit = () => getLink({variables: { data: formData }})

    return (
            <Modal
            open={modal}
            onClose={() => setModal(false)}
            aria-labelledby="pos-modal"
            aria-describedby="pos-modal"
            >
                <Grid 
                    container xs={12}
                    justify="center"
                    alignItems="center"
                >
                <Paper className={classes.paper}>
                    <FontAwesomeIcon icon='check' pull="right" border onClick={() => setModal(false)}/>
                    <Typography variant="h4">
                        Organization Information
                    </Typography>
                    <Grid container spacing={3}>
                        {inputs.map(item => {
                        return (
                            <Grid item xs={12} sm={12} md={6}>
                            <TextField required
                                        style={{width: "100%"}}
                                        value={get(formData, item.slug) || ""}
                                        onChange={handleChange(item.slug)}
                                        label={item.label}
                                        variant="outlined"/>
                            </Grid>
                            )
                        })}
                    </Grid>

                    <Button onClick={submit} variant="contained" className={classes.button}>
                        Submit
                    </Button>
                </Paper>
                </Grid>
            </Modal>
    )
}

export default POSModal