import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useHistory, useParams } from 'react-router';
import AllocationsTable from '../../../utils/AllocationsTable';
import styles from '../../../dashboard/InvestorDashboard/styles';

const spvHeaders = [
  {
    label: 'PORTFOLIO COMPANY',
    value: 'company_name',
    type: 'company_name',
    isSortable: true,
    align: 'center',
    alignHeader: true,
    keyNotInData: true,
  },
  {
    label: 'STATUS',
    value: 'status',
    type: 'status',
    isSortable: true,
    align: 'left',
    alignHeader: false,
  },
  {
    label: 'CREATED',
    value: 'created_at',
    type: 'created_at',
    isSortable: true,
    align: 'center',
  },
  {
    label: 'WIRE DEADLINE DATE',
    value: 'wire_deadline',
    type: 'wire_deadline',
    isSortable: true,
    align: 'center',
    alignHeader: true,
    keyNotInData: true,
  },
  {
    label: 'MANAGE',
    value: 'slug',
    type: 'manage',
    align: 'center',
    isSortable: false,
    alignHeader: false,
  },
];

const getStatusColors = (status) => {
  switch (status) {
    case 'build':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'post-build':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'entity':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'post-entity':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'pre-onboarding':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'Onboarding':
    case 'onboarding':
      return { backgroundColor: 'rgb(4, 97, 255, .25)', color: '#0461FF' };
    case 'Closed':
    case 'closed':
      return { backgroundColor: 'rgb(255, 4, 4, .20)', color: '#FF0404' };
    case 'Complete':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    default:
      return { backgroundColor: 'rgba(0,0,0,0)', color: 'red' };
  }
};

const DealsTable = ({ classes, deals }) => {
  const { org_slug } = useParams();
  const headers = spvHeaders;
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'name':
        return row.name;
      case 'company_name':
        return row.company_name;
      case 'status':
        return (
          <div
            className={classes.statusContainer}
            style={{
              color: getStatusColors(row.status).color,
              backgroundColor: getStatusColors(row.status).backgroundColor,
              margin: 'auto',
            }}
          >
            {row[headerValue]}
          </div>
        );
      case 'created_at':
        return moment(row.created_at).fromNow();
      case 'wire_deadline':
        return moment(row.dealParams.wireDeadline).isBefore(moment())
          ? 'Closed'
          : moment(row.dealParams.wireDeadline).format('dddd, MMMM Do YYYY');
      case 'manage':
        return (
          <Button
            variant="contained"
            color="primary"
            style={{ borderRadius: '.5rem' }}
            onClick={() => history.push(`/deals/${org_slug}/${row.slug}`)}
          >
            Manage
          </Button>
        );
      default:
        return <div />;
    }
  };

  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  const dataCopy = deals.filter((doc) =>
    `${doc.name} ${doc.portfolioCompany}`.toUpperCase().includes(searchTerm.toUpperCase()),
  );

  return (
    <div className={classes.tableContainer}>
      <AllocationsTable data={dataCopy} headers={headers} getCellContent={getCellContent} />
    </div>
  );
};

export default withStyles(styles)(DealsTable);
