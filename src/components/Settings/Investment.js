import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Paper,
  Typography
} from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Loader from '../utils/Loader';
import { GridSection, Section, DocumentBox } from './common.js'


const GET_INVESTMENT = gql`
  query Investment($_id: String) {
    investment(_id: $_id) {
      _id
      amount
      status
      created_at
      updated_at
      deal {
        _id
        company_name
        slug
        target
        amount_raised
      }
      documents {
        path
        link
      }
      investor {
        _id
        first_name
        last_name
        email
        entity_name,
        country
      }
      submissionData {
        country
        state
        investor_type
        legalName
        accredited_investor_status
        fullName
        title
      }
    }
  }
`;

const styles = theme => ({
  back: {
    color: "#0040FE",
    cursor: "pointer"
  },
  button: {
    color: "#0040FE",
    marginLeft: "1em",
    cursor: "pointer"
  },
  buttonsContainer: {
    display: "flex",
    alignItems: 'center'
  },
  documentsContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap"
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    marginBottom: "25px"
  },
  investmentInformation: {
    marginBottom: "40px"
  }
});

const fields = {
  investment: [
    {label: 'Amount', value: 'amount'},
    {label: 'Status', value: 'status'},
    {label: 'Created', value: 'created_at'},
    {label: 'Updated', value: 'updated_at'},
  ],
  investor: [
    {label: 'First Name', value: 'first_name'},
    {label: 'Last Name', value: 'last_name'},
    {label: 'Email', value: 'email'},
    {label: 'Entity', value: 'entity_name'},
    {label: 'Country', value: 'country'},
    {label: 'Is Admin', value: 'admin'},
  ],
  deal: [
    {label: 'Company', value: 'company_name'},
    {label: 'Target', value: 'target'},
    {label: 'Raised', value: 'amount_raised'}
  ],
  submissionData: [
    {label: 'Country', value: 'country'},
    {label: 'State', value: 'state'},
    {label: 'Investor Type', value: 'investor_type'},
    {label: 'Legal Name', value: 'legalName'},
    {label: 'Accredited Investor', value: 'accredited_investor_status'},
    {label: 'Full Name', value: 'fullName'},
    {label: 'Title', value: 'title'}
  ]
}


const Investment = ({
  classes,
  history,
  match: {
    params: {
      investmentId
    }
  }
}) => {
  const { data } = useQuery(GET_INVESTMENT, { variables: { _id: investmentId } });

  const goBack = () => {
    history.goBack()
  }

  const handleEdit = () => {
    console.log('EDIT');
  }

  const handleDelete = () => {
    console.log('DELETE');
  }

  if (!data) return <Loader />;

  const { investment } = data;
  const { investor, deal, documents, submissionData } = investment;

  return (
    <div className={classes.root}>
      <Paper square className={classes.titleContainer}>
        <Typography className={classes.back} onClick={goBack}><NavigateBeforeIcon/> Back</Typography>
        <Typography style={{color: "rgb(42,43,84,77%)"}}>{`Investment - ${investment._id}`}</Typography>
        <div className={classes.buttonsContainer}>
          <Typography className={classes.button} onClick={handleEdit}>Edit</Typography>
          <Typography className={classes.button} onClick={handleDelete}>Delete</Typography>
        </div>
      </Paper>
      <Paper square className={classes.investmentInformation}>
        <GridSection
          title="Investor Information"
          fields={fields.investor}
          item={investor}
          />
        <GridSection
          title="Deal Information"
          fields={fields.deal}
          item={deal}
          />
        <GridSection
          title="Investment Information"
          fields={fields.investment}
          item={investment}
          />
        <GridSection
          title="Submission Data"
          fields={fields.submissionData}
          item={submissionData}
          />
        <Section title="Documents">
          <div className={classes.documentsContainer}>
            {documents.map((doc, index) =>
              <DocumentBox
                doc={doc}
                docPath={doc.path.split('/')[2]}
                index={index}
                key={`doc-${index}`}
                />
            )}
          </div>
        </Section>
      </Paper>
    </div>
  );
}

export default withStyles(styles)(withRouter(Investment));
