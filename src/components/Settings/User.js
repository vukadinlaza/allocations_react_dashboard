import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Document } from 'react-pdf';
import AllocationsTable from '../utils/AllocationsTable';
import Loader from '../utils/Loader';
import { nWithCommas } from '../../utils/numbers';
import { GridSection, Section, DocumentBox } from './common';

const GET_USER = gql`
  query Investor($_id: String) {
    investor(_id: $_id) {
      _id
      first_name
      last_name
      email
      entity_name
      country
      admin
      account {
        _id
        rootAdmin {
          _id
        }
        users {
          _id
          email
        }
      }
      investorLimits
      investorTaxDocuments
      investments {
        _id
        amount
        status
        deal {
          _id
          company_name
        }
      }
    }
  }
`;

const styles = (theme) => ({
  back: {
    color: '#0040FE',
    cursor: 'pointer',
  },
  button: {
    color: '#0040FE',
    marginLeft: '1em',
    cursor: 'pointer',
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '300px',
    width: '50%',
    marginBottom: '30px',
  },
  fieldTitle: {
    fontWeight: 'bold',
    color: 'rgb(42,43,84,77%)',
    marginBottom: '8px',
  },
  fieldValue: {
    color: 'rgb(42,43,84,77%)',
  },
  section: {
    padding: '30px 40px 0px 40px',
    borderBottom: 'solid 1px rgba(0, 0, 0, 0.12)',
  },
  sectionContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
    paddingBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '28px',
    color: 'rgb(42,43,84,77%)',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    marginBottom: '25px',
  },
  documentsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});

const fields = {
  investor: [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Email', value: 'email' },
    { label: 'Entity', value: 'entity_name' },
    { label: 'Country', value: 'country' },
    { label: 'Is Admin', value: 'admin' },
  ],
  account: [
    { label: 'Root Admin', value: 'rootAdmin' },
    { label: 'Users', value: 'users' },
  ],
};

const investmentsHeaders = [
  { label: 'Deal', value: 'deal', type: 'deal' },
  { label: 'Status', value: 'status' },
  { label: 'Amount', value: 'amount', type: 'amount', align: 'right' },
];

const User = ({
  classes,
  history,
  match: {
    params: { userId },
  },
}) => {
  const { data } = useQuery(GET_USER, { variables: { _id: userId } });

  const goBack = () => {
    history.goBack();
  };

  const handleEdit = () => {
    console.log('EDIT');
  };

  const handleDelete = () => {
    console.log('DELETE');
  };

  const handleRowDetailPage = () => {
    console.log('detail');
  };

  const getCellContent = (type, row, headerValue, value) => {
    switch (type) {
      case 'deal':
        return row[headerValue].company_name;
      case 'amount':
        return nWithCommas(row[headerValue]);
      default:
        return <div />;
    }
  };

  if (!data) return <Loader />;

  const { investor } = data;
  const { account } = investor;

  const title =
    investor?.first_name && investor?.last_name
      ? `${investor.first_name} ${investor.last_name}`
      : investor.email;

  return (
    <div className={classes.root}>
      <Paper square className={classes.titleContainer}>
        <Typography className={classes.back} onClick={goBack}>
          <NavigateBeforeIcon /> Back
        </Typography>
        <Typography style={{ color: 'rgb(42,43,84,77%)' }}>{title}</Typography>
        <div className={classes.buttonsContainer}>
          <Typography className={classes.button} onClick={handleEdit}>
            Edit
          </Typography>
          <Typography className={classes.button} onClick={handleDelete}>
            Delete
          </Typography>
        </div>
      </Paper>
      <Paper square className={classes.userInformation}>
        <GridSection title="Personal Information" fields={fields.investor} item={investor} />
        <GridSection title="Related Account" fields={fields.account} item={account} />
        <Section title="KYC Documents">
          <div className={classes.documentsContainer}>
            {investor?.investorTaxDocuments.map((doc, index) => (
              <DocumentBox doc={doc} docPath={doc.name} index={index} key={`doc-${index}`} />
            ))}
          </div>
        </Section>
        <Section title="Investments">
          <div className={classes.sectionContent}>
            <AllocationsTable
              data={investor.investments}
              headers={investmentsHeaders}
              rowDetailPage
              handleRowDetailPage={handleRowDetailPage}
              getCellContent={getCellContent}
            />
          </div>
        </Section>
      </Paper>
    </div>
  );
};

export default withStyles(styles)(withRouter(User));
