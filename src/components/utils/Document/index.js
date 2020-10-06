import React, { useState, useEffect } from 'react'
import { get, isEqual, pick, omit } from "lodash"
import { useParams, Redirect } from "react-router-dom"
import { Row, Col } from 'reactstrap'
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
    Button,
    TextField,
    Paper,
    Divider,
    Grid,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Typography
} from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";



const Document = ({ doc, investment, refetch, RM_DOC }) => {
    const file = doc?.path.slice(0, 12) === "investments/" ? doc.path.split('/')[2] : doc.path.split('/')[1]
    console.log(doc, 'FILE')
    return (
        <a href={`https://${doc?.link}`} target="_blank" rel="noopener noreferrer">
            <Paper style={{ flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: "20%", textAlign: 'center', padding: '.5rem', minHeight: '8rem', borderRadius: '1rem' }}>
                <img src='https://allocations-public.s3.us-east-2.amazonaws.com/file-icon.svg' />
                <Typography variant="subtitle2" style={{ maxWith: '20%', wordBreak: 'break-all', fontSize: '.7rem', paddingLeft: '.75rem', paddingRight: '.75rem' }}>
                    <span style={{ color: 'blue' }}>{file || doc?.path}</span>
                </Typography>
            </Paper>
        </a>
    )
}
export default Document