import React, { useState, useEffect } from 'react';
import moment from 'moment';
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
  TableBody,
  TextField,
  TableRow,
  Collapse,
  Box,
  InputAdornment,
  Grid,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import EditIcon from '@material-ui/icons/Edit';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { nWithCommas } from '../../../utils/numbers';
import { DocumentBox } from '../../Settings/common';
import { titleCase } from '../../../utils/helpers';
import Loader from '../../utils/Loader';
import { useAuth } from '../../../auth/useAuth';
import AppModal from '../../Modal/AppModal';
import InvestmentEdit from '../../InvestmentEdit/UpdateInvestment';
import DeleteViewedUser from '../../InvestmentEdit/DeleteViewedUser';

const styles = (theme) => ({
  back: {
    cursor: 'pointer',
    marginBottom: '20px',
    fontWeight: 'bold',
    '&:hover': {
      color: '#0040FE',
    },
  },
  button: {
    color: 'white',
    fontSize: '16px',
  },
  buttonLink: {
    borderRadius: '100%',
    backgroundColor: '#0462FF',
    padding: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '-6px 0',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#3f85f9',
    },
  },
  cellText: {
    color: '#2A2B54 !important',
  },
  headerText: {
    color: '#2A2B54 !important',
    fontWeight: '400',
  },
  mainTitle: {
    fontSize: '28px',
    fontWeight: '700',
    padding: '0px',
    paddingBottom: '20px',
  },
  row: {
    '&:hover': {
      background: '#f1f4fb',
    },
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '25px',
    background: 'white',
    padding: '15px 20px',
    border: 'solid 1px #dadada',
    boxShadow: '0px 3px 5px -5px',
    borderRadius: '3px',
  },
  selectedCheckbox: {
    color: theme.palette.primary.main,
  },
  tableContainer: {
    background: '#FBFCFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #8493A640',
    borderRadius: '10px',
    marginBottom: '50px',
  },
  table: {},
});

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

const investmentHeaders = ['DEAL', 'DATE CREATED', 'AMOUNT', 'STATUS', 'EDIT', 'DOCUMENTS'];

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
          <span onClick={onClick} className={classes.buttonLink}>
            <EditIcon className={classes.button} />
          </span>
        </TableCell>
        <TableCell component="th" scope="row" className={classes.cellText}>
          <span className={classes.buttonLink} onClick={() => setOpen(!open)}>
            <PlayArrowIcon className={classes.button} />
          </span>
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
  const { data, refetch } = useQuery(GET_USER, { variables: { _id: userId } });

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
  const userIdCopy = data?.investor?._id;

  if (!userInvestments) return <Loader />;
  const dataCopy = JSON.parse(JSON.stringify(data));
  dataCopy.investor.investments = dataCopy.investor.investments.filter((inv) =>
    `${inv.deal.company_name} ${inv.status}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <Typography className={classes.mainTitle}>
        {data?.investor?.name || 'Investor'} Investments
      </Typography>
      <Typography className={classes.back} onClick={() => history.goBack()}>
        <NavigateBeforeIcon /> Back to Investors
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
                  <TableCell key={`header-${index}`} className={classes.headerText}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataCopy?.investor?.investments?.map((row, index) => (
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Loader />
      )}
      <AppModal isOpen={showModal} onClose={onClose}>
        {investmentId ? (
          <InvestmentEdit
            investmentId={investmentId}
            handleUpdate={handleUpdate}
            userIdCopy={userIdCopy}
          />
        ) : (
          <DeleteViewedUser dealId={dealId} investorId={investorId} handleUpdate={handleUpdate} />
        )}
      </AppModal>
    </div>
  );
};

export default withStyles(styles)(withRouter(InvestorInvestments));
