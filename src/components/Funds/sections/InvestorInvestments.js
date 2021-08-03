import React, { useState, useEffect } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { useQuery, gql } from '@apollo/client';
import { useParams, withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TableContainer,
  TableCell,
  Paper,
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TextField,
  TableRow,
  Collapse,
  Box,
  InputAdornment,
  Grid,
  Tooltip,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import EditIcon from '@material-ui/icons/Edit';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { nWithCommas } from '../../../utils/numbers';
import { DocumentBox } from '../../Settings/common';
import { titleCase } from '../../../utils/helpers';
import Loader from '../../utils/Loader';
import { useAuth } from '../../../auth/useAuth';
import AppModal from '../../Modal/AppModal';
import InvestmentEdit from '../../InvestmentEdit/UpdateInvestment';
import DeleteViewedUser from '../../InvestmentEdit/DeleteViewedUser';
import styles from '../styles.js';

const GET_USER = gql`
  query Investor($_id: String) {
    investor(_id: $_id) {
      _id
      name
      investments {
        _id
        amount
        status
        updated_at
        documents {
          path
          link
        }
        deal {
          _id
          company_name
        }
      }
    }
  }
`;

const investmentHeaders = [
  { label: 'DEAL', value: 'deal.company_name', isSortable: true },
  { label: 'DATE CREATED', value: '_id', isSortable: true },
  { label: 'AMOUNT', value: 'amount', isSortable: true },
  { label: 'STATUS', value: 'status', isSortable: true },
  { label: 'LINKS', value: '', isSortable: false },
];

const getStatusColors = (status) => {
  switch (status) {
    case 'complete':
      return { backgroundColor: '#C9EEC8', color: '#58CE46' };
    case 'wired':
      return { backgroundColor: '#FFE9BF', color: '#FFA700' };
    case 'signed':
      return { backgroundColor: '#c8a1fc', color: '#7d20f7' };
    case 'pledged':
      return { backgroundColor: '#f99fc2', color: '#f92576' };
    case 'closed':
      return { backgroundColor: '#CECECE', color: '#3D3D3D' };
    case 'invited':
      return { backgroundColor: '#C0D7FF', color: '#0461FF' };
    default:
      return { backgroundColor: 'rgba(0,0,0,0)', color: 'red' };
  }
};

function descendingComparator(a, b, orderBy) {
  if (_.get(b, orderBy, '') < _.get(a, orderBy, '')) {
    return -1;
  }
  if (_.get(b, orderBy, '') > _.get(a, orderBy, '')) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const InvestmentRow = ({
  row,
  classes,
  setShowModal,
  setInvestmentId,
  superAdmin,
  setDealId,
  setInvestorId,
}) => {
  const [open, setOpen] = React.useState(false);

  const onClick = () => {
    if (superAdmin) {
      setShowModal(true);
      if (row._id) {
        setInvestmentId(row._id);
      } else {
        setDealId(row.deal_id);
        setInvestorId(row.user_id);
      }
    }
  };

  return (
    <>
      <TableRow className={classes.row}>
        <TableCell component="th" scope="row" className={classes.cellText}>
          {row.deal.company_name}
        </TableCell>
        <TableCell component="th" scope="row" className={classes.cellText}>
          {moment(new Date(parseInt(row._id.substring(0, 8), 16) * 1000)).format('MM/DD/YYYY')}
        </TableCell>
        <TableCell component="th" scope="row" className={classes.cellText}>
          {`$${nWithCommas(row.amount)}`}
        </TableCell>
        <TableCell component="th" scope="row" className={classes.cellText}>
          <div
            style={{
              color: getStatusColors(row.status).color,
              backgroundColor: getStatusColors(row.status).backgroundColor,
              fontWeight: 'bold',
              padding: '0.3em 2em',
              borderRadius: '2em',
              width: '120px',
              textAlign: 'center',
            }}
          >
            {titleCase(row.status)}
          </div>
        </TableCell>
        <TableCell component="th" scope="row" className={classes.cellText} align="center">
          <div className={classes.links}>
            <Tooltip title="Edit">
              <span onClick={onClick} className={classes.buttonLink}>
                <EditIcon className={classes.button} />
              </span>
            </Tooltip>
            <Tooltip title="Documents">
              <span className={classes.buttonLink} onClick={() => setOpen(!open)}>
                <InsertDriveFileIcon className={classes.button} />
              </span>
            </Tooltip>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} style={{ padding: '15px 0' }}>
              <Typography variant="h6" gutterBottom component="div">
                Documents
              </Typography>
              <Grid container spacing="3">
                {row?.documents?.map((doc, index) => (
                  <Grid item xs="6" key={`doc-${index}`}>
                    <DocumentBox doc={doc} docPath={doc.path.split('/')[2]} index={index} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const InvestorInvestments = ({ classes, history }) => {
  const { userId } = useParams();
  const { userProfile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [dealId, setDealId] = useState(null);
  const [investorId, setInvestorId] = useState(null);
  const [investmentId, setInvestmentId] = useState(null);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('deal.company_name');
  const { data, refetch } = useQuery(GET_USER, { variables: { _id: userId } });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property, isSortable) => (event) => {
    if (!isSortable) return;
    handleRequestSort(event, property);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const handleUpdate = () => {
    refetch();
    setShowModal(false);
  };

  const userInvestments = data?.investor?.investments;

  if (!userInvestments) return <Loader />;
  const dataCopy = JSON.parse(JSON.stringify(data));
  dataCopy.investor.investments = dataCopy.investor.investments.filter((inv) =>
    `${inv.deal.company_name} ${inv.status}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <Typography className={classes.investmentsMainTitle}>
        {data?.investor?.name || 'Investor'} Investments
      </Typography>
      <Typography className={classes.back} onClick={() => history.push('/admin/funds')}>
        <NavigateBeforeIcon /> Back to Admin Dashboard
      </Typography>
      <div className={classes.searchContainer}>
        <TextField
          label="Search"
          placeholder="Search by Investments"
          fullWidth
          onChange={handleSearch}
          value={searchTerm || ''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
              </InputAdornment>
            ),
          }}
          style={{ margin: '0 1em' }}
        />
      </div>
      {dataCopy ? (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {investmentHeaders.map((header, index) => (
                  <TableCell key={`header-${index}`} className={classes.headerText} align="center">
                    <TableSortLabel
                      active={header.isSortable && orderBy === header.value}
                      direction={orderBy === header.value ? order : 'asc'}
                      onClick={createSortHandler(header.value, header.isSortable)}
                      hideSortIcon={!header.isSortable}
                    >
                      {header.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataCopy?.investor?.investments
                ? stableSort(dataCopy.investor.investments, getComparator(order, orderBy)).map(
                    (row, index) => (
                      <InvestmentRow
                        key={row.name}
                        row={row}
                        classes={classes}
                        setShowModal={setShowModal}
                        setInvestmentId={setInvestmentId}
                        superAdmin={userProfile?.admin}
                        setDealId={setDealId}
                        setInvestorId={setInvestorId}
                        key={`row-${index}`}
                      />
                    ),
                  )
                : ''}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Loader />
      )}
      <AppModal isOpen={showModal} onClose={onClose}>
        {investmentId ? (
          <InvestmentEdit investmentId={investmentId} handleUpdate={handleUpdate} />
        ) : (
          <DeleteViewedUser dealId={dealId} investorId={investorId} handleUpdate={handleUpdate} />
        )}
      </AppModal>
    </div>
  );
};

export default withStyles(styles)(withRouter(InvestorInvestments));
