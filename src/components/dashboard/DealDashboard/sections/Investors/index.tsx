import React, { useState } from 'react';
import moment from 'moment';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Chip,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ViewAgendaOutlinedIcon from '@material-ui/icons/ViewAgendaOutlined';
import ViewWeekOutlinedIcon from '@material-ui/icons/ViewWeekOutlined';
import styles from '../../styles';
import Board from './components/Board';
import NewAllocationsTable from '../../../../utils/NewAllocationsTable';
import { nWithCommas } from '../../../../../utils/numbers';
import { titleCase } from '../../../../../utils/helpers';
import { getChipStyle, sortByStatus } from './helpers';

interface Props extends WithStyles<typeof styles> {
  investorsData: Investment[];
}

interface Header {
  value: string;
  label: string;
  type: string;
  keyNotInData?: boolean;
  align?: string;
  alignHeader?: boolean;
  isSortable?: boolean;
  customSort?: boolean;
}

export interface Investment {
  amount: number;
  investor: {
    accredidation_status: string;
    email: string;
    first_name: string;
    last_name: string;
    name: string;
    _id: string;
  };
  status: string;
  updated_at: string;
  _id: string;
}

const investorsHeaders: Header[] = [
  {
    value: 'investor',
    label: 'Investor',
    type: 'investor',
    keyNotInData: true,
    align: 'left',
    alignHeader: true,
    isSortable: true,
    customSort: true,
  },
  {
    value: 'status',
    label: 'Status',
    type: 'status',
    keyNotInData: true,
    align: 'left',
    alignHeader: true,
    isSortable: true,
    customSort: true,
  },
  {
    value: 'amount',
    label: 'Investment',
    type: 'investment',
    keyNotInData: true,
    align: 'left',
    alignHeader: true,
    isSortable: true,
  },
];

const Investors: React.FC<Props> = ({ classes, investorsData }) => {
  const dashboardBoxes: { title: string; value: number | string }[] = [
    {
      title: 'Total Investors',
      value: new Set([...investorsData.map((investment: Investment) => investment.investor?.email)])
        .size,
    },
    {
      title: 'Total Invested',
      value: `$${nWithCommas(
        investorsData
          .map((investment: Investment) => investment.amount)
          .reduce((acc: number, n: number) => acc + n),
      )}`,
    },
  ];
  const boxSize = 2;
  const containerSpacing = 2;
  const invisibleBoxes = Array(5 - dashboardBoxes.length).fill(0);
  const [currentView, setCurrentView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewChange = (newView: string): void => {
    setCurrentView(newView);
  };

  const getCellContent = (type: string, row: Investment, headerValue: string) => {
    switch (type) {
      case 'investor': {
        const { investor } = row;
        const fullName = `${titleCase(investor.first_name)} ${titleCase(investor.last_name)}`;
        return (
          <div>
            <p
              className={`${classes.cellValue} ${classes.textTop}`}
              style={{ marginBottom: '4px' }}
            >
              {fullName ? fullName : '---'}
            </p>
            <p className={`${classes.cellValue} ${classes.textBottom}`}>{investor.email}</p>
          </div>
        );
      }
      case 'status':
        return (
          <div>
            <Chip
              label={row.status !== 'complete' ? titleCase(row.status) : 'Wired'}
              style={getChipStyle(row.status.toLowerCase())}
            />
          </div>
        );
      case 'investment':
        return (
          <div>
            <p
              className={`${classes.cellValue} ${classes.textTop}`}
              style={{ marginBottom: '4px' }}
            >
              {row.amount ? `$${nWithCommas(row.amount)}` : ''}
            </p>
            <p className={`${classes.cellValue} ${classes.textBottom}`}>
              {row.updated_at ? moment(row.updated_at, 'x').format('MM/DD/YYYY') : ''}
            </p>
          </div>
        );
      default:
        return <p></p>;
    }
  };

  const getSortedData = (data: Investment[], property: string, order: string) => {
    const dataCopy = JSON.parse(JSON.stringify(data));
    switch (property) {
      case 'investor':
        return dataCopy.sort((a: Investment, b: Investment) => {
          const aFullName = `${a?.investor?.first_name}${a?.investor?.last_name}`;
          const bFullName = `${b?.investor?.first_name}${b?.investor?.last_name}`;
          const _a = aFullName ? aFullName : a?.investor?.email;
          const _b = bFullName ? bFullName : b?.investor?.email;
          return ('' + (order === 'desc' ? _b : _a)).localeCompare(order === 'desc' ? _a : _b);
        });
      case 'status': {
        return sortByStatus(data, 'status', order);
      }
      default:
        return data;
    }
  };

  const updateSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log({ event });
    setSearchTerm(event.currentTarget.value);
  };

  const data = searchTerm
    ? investorsData.filter((investment: Investment) => {
        const { investor } = investment;
        const investorName = `${investor.first_name}${investor.last_name}`;
        return `${investorName}${investment?.investor?.email}`
          .toLocaleLowerCase()
          .includes(searchTerm.toLocaleLowerCase())
          ? true
          : false;
      })
    : investorsData;

  return (
    <>
      <Grid container spacing={containerSpacing}>
        <Grid item xs={1} />
        {dashboardBoxes.map((box, index) => (
          <Grid key={`box-${index}`} item lg={boxSize}>
            <Paper elevation={0} className={classes.smallBox}>
              <Typography className={classes.boxTitle}>{box.title}</Typography>
              <Typography className={classes.boxValue}>{box.value}</Typography>
            </Paper>
          </Grid>
        ))}
        {invisibleBoxes.length &&
          invisibleBoxes.map((box, index) => <Grid item key={`box-${index}`} xs={boxSize} />)}
        <Grid item xs={1} />
      </Grid>
      <Grid container spacing={containerSpacing} className={classes.searchContainer}>
        <Grid item xs={1} />
        <Grid item lg={4}>
          <TextField
            variant="outlined"
            placeholder="Search investor"
            className={classes.textFieldRoot}
            onChange={(e) => updateSearch(e)}
            InputLabelProps={{ style: { top: '-4px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              classes: { input: classes.input, root: classes.inputRoot },
            }}
            inputProps={{
              style: { padding: '14.5px 14px 14.5px 0', background: 'white' },
            }}
          />
        </Grid>
        <Grid item lg={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '95px' }} className={classes.viewButtonContainer}>
            <Button
              variant="outlined"
              disableFocusRipple
              disableRipple
              color={`${currentView === 'list' ? 'primary' : 'inherit'}`}
              className={`${classes.viewButton} ${
                currentView === 'list' ? classes.viewButtonSelected : ''
              }`}
              onClick={(e) => handleViewChange('list')}
            >
              <ViewAgendaOutlinedIcon style={{ height: '18px' }} />
              List
            </Button>
          </div>
          <div style={{ width: '109px' }} className={classes.viewButtonContainer}>
            <Button
              variant="outlined"
              disableFocusRipple
              disableRipple
              color={`${currentView === 'board' ? 'primary' : 'inherit'}`}
              className={`${classes.viewButton} ${
                currentView === 'board' ? classes.viewButtonSelected : ''
              }`}
              onClick={() => handleViewChange('board')}
            >
              <ViewWeekOutlinedIcon style={{ height: '22px' }} />
              Board
            </Button>
          </div>
        </Grid>
        <Grid item xs={1} />
      </Grid>
      {currentView === 'list' ? (
        <Grid container spacing={containerSpacing}>
          <Grid item xs={1} />
          <Grid item lg={10}>
            <NewAllocationsTable
              headers={investorsHeaders}
              getCellContent={getCellContent}
              data={data}
              listOf="investors"
              pagination={true}
              getSortedData={getSortedData}
            />
          </Grid>
          <Grid item xs={1} />
        </Grid>
      ) : (
        <Board data={data} />
      )}
    </>
  );
};

export default withStyles(styles)(Investors);
