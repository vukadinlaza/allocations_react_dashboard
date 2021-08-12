import React, { useState } from 'react';
import moment from 'moment';
import { useMutation, gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { Tooltip, Typography, Grid, TextField, InputAdornment, Button } from '@material-ui/core';
import { toast } from 'react-toastify';
import StorefrontIcon from '@material-ui/icons/Storefront';
import DashboardIcon from '@material-ui/icons/Dashboard';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ServerTable from '../../utils/ServerTable';
import { nWithCommas } from '../../../utils/numbers';
import { titleCase } from '../../../utils/helpers';
import AppModal from '../../Modal/AppModal';

const tableVariables = {
  gqlQuery: `
    query FundAdminTables($filter: Object, $pagination: PaginationInput!) {
      fundAdminTables(filter: $filter, pagination: $pagination) {
        count
        deals {
          _id
          company_name
          deal_lead
          AUM
          status
          slug
          investmentType
          dealParams{
            dealMultiple
            signDeadline
            wireDeadline
          }
          dealOnboarding {
            _id
          }
          organization {
            _id
            slug
          }
        }
      }
    }`,
  headers: [
    { value: 'company_name', label: 'NAME', isFilter: true, isSortable: true },
    { value: 'deal_lead', label: 'FUND MANAGER', isFilter: true, isSortable: true },
    { value: 'AUM', label: 'AUM', type: 'amount', isSortable: true },
    {
      value: 'dealMultiple',
      label: 'MULTIPLE',
      type: 'multiple',
      isSortable: true,
      keyNotInData: true,
    },
    {
      value: 'dealParams',
      label: 'CLOSE DATE',
      type: 'wireDeadline',
      nestedKey: 'wireDeadline',
      sortField: 'dealParams',
      isSortable: true,
    },
    {
      value: 'dealOnboarding',
      label: 'PROCESS STREET STATUS',
      type: 'onboarding',
      isSortable: true,
    },
    { value: 'status', label: 'DEAL STATUS', type: 'status', isFilter: true, isSortable: true },
    { value: 'links', label: 'LINKS', type: 'links', keyNotInData: true, align: 'center' },
  ],
  resolverName: 'fundAdminTables',
  dataVariable: 'deals',
  defaultSortField: 'AUM',
};

const UPDATE_DEAL = gql`
  mutation UpdateDeal($org: String!, $deal: DealInput!) {
    updateDeal(org: $org, deal: $deal) {
      _id
    }
  }
`;

const Deals = ({ classes, filter, tableName }) => {
  const [modalData, setModalData] = useState({});
  const [multiple, setMultiple] = useState({});
  const [refetchCount, setRefetchCount] = useState(0); // ServerTable needs a change in this to refetch
  const [updateDeal] = useMutation(UPDATE_DEAL, {
    onCompleted: () => {
      toast.success('Deal updated successfully');
      handleClose();
      setRefetchCount((prev) => prev + 1);
    },
  });

  const handleModal = (row) => {
    const rowMultiple = row?.dealParams?.dealMultiple || 1;
    setModalData(row);
    setMultiple(rowMultiple);
  };

  const handleClose = () => {
    setModalData({});
  };

  const handleMultipleChange = (event) => {
    const newMultiple = event.target.value;
    setMultiple(newMultiple);
  };

  const handleUpdateDeal = () => {
    if (multiple < 0) {
      toast.error(`Sorry! Multiple can not be a negative`);
      return;
    }
    updateDeal({
      variables: {
        deal: {
          _id: modalData._id,
          dealParams: { dealMultiple: multiple },
        },
        org: modalData.organization.slug,
      },
    });
  };

  const getCellContent = (type, row, headerValue) => {
    switch (type) {
      case 'managers':
        return row[headerValue];
      case 'amount':
        return `$${nWithCommas(row[headerValue])}`;
      case 'multiple':
        return (
          <div>
            {`${row.dealParams[headerValue]}x`}
            <EditIcon className={classes.editMultiple} onClick={(e) => handleModal(row)} />
          </div>
        );
      case 'wireDeadline':
        return row[headerValue]?.wireDeadline
          ? moment(row[headerValue].wireDeadline).format('MM/DD/YYYY')
          : '';
      case 'onboarding':
        return row[headerValue] ? 'Complete' : 'Pending';
      case 'status':
        return titleCase(row[headerValue]);
      case 'links':
        return (
          <div className={classes.links}>
            <Tooltip title="Edit">
              <a
                href={`/admin/${row.organization.slug}/deals/${row._id}/edit`}
                className={classes.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <EditIcon className={classes.button} />
              </a>
            </Tooltip>
            <Tooltip title="Deal Page">
              <a
                href={`/deals/${row.organization.slug}/${row.slug}`}
                className={classes.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StorefrontIcon className={classes.button} />
              </a>
            </Tooltip>
            <Tooltip title="Dashboard">
              <a
                href={`/admin/${row.organization.slug}`}
                className={classes.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <DashboardIcon className={classes.button} />
              </a>
            </Tooltip>
          </div>
        );
      default:
        return <div />;
    }
  };

  tableVariables.tableName = tableName;

  return (
    <div>
      <ServerTable
        tableVariables={tableVariables}
        getCellContent={getCellContent}
        queryVariables={filter}
        refetchCount={refetchCount}
        defaultSortOrder={-1}
      />
      <AppModal isOpen={Object.keys(modalData).length} onClose={handleClose}>
        <Typography className={classes.title}>Update Multiple</Typography>
        <Grid spacing={3} container className={classes.formContainer}>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Fund Name"
              value={modalData.company_name}
              variant="outlined"
              size="small"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Type"
              value={modalData.investmentType === 'fund' ? 'Fund' : 'SPV'}
              variant="outlined"
              size="small"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Closing Date"
              value={moment(modalData.dealParams?.wireDeadline).format('MM/DD/YYYY')}
              variant="outlined"
              size="small"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Amount Raised"
              value={`$${nWithCommas(modalData.AUM)}`}
              variant="outlined"
              size="small"
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Multiple"
              value={multiple}
              variant="outlined"
              size="small"
              fullWidth
              type="number"
              onChange={handleMultipleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">X</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleUpdateDeal} className={classes.updateButton}>
              Update Multiple
            </Button>
            <Button onClick={handleClose} className={classes.cancelButton}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </AppModal>
    </div>
  );
};

export default withRouter(Deals);
