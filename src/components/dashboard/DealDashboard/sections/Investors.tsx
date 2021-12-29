import React, { useState } from 'react';
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
import styles from '../styles';
import NewAllocationsTable from '../../../utils/NewAllocationsTable';
import { nWithCommas } from '../../../../utils/numbers';

interface Props extends WithStyles<typeof styles> {}

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

interface Investor {
  name: string;
  email: string;
  status: string;
  investment: number;
  investmentDate: string;
}

interface ChipStyle {
  fontSize: string;
  fontWeight: number;
  borderRadius: string;
  height: string;
  background?: string;
  color?: string;
}

const dashboardBoxes = [
  {
    title: 'Total Investors',
    value: `10`,
  },
  {
    title: 'Total Invested',
    value: `$1,800,000`,
  },
];

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
    value: 'investment',
    label: 'Investment',
    type: 'investment',
    keyNotInData: true,
    align: 'left',
    alignHeader: true,
    isSortable: true,
  },
];

const investorsData: Investor[] = [
  {
    name: 'Alexander Winter',
    email: 'alexanderwinter@gmail.com',
    status: 'Viewed',
    investment: 0,
    investmentDate: '',
  },
  {
    name: 'Brandon Lee',
    email: 'lee@gmail.com',
    status: 'Invited',
    investment: 0,
    investmentDate: '',
  },
  { name: '', email: 'raribrown@gmail.com', status: 'Invited', investment: 0, investmentDate: '' },
  {
    name: 'Dan Green',
    email: 'dangreen@gmail.com',
    status: 'Signed',
    investment: 700000,
    investmentDate: '12/17/2021',
  },
  {
    name: 'Edith Jones',
    email: 'edithjones@gmail.com',
    status: 'Invited',
    investment: 0,
    investmentDate: '',
  },
  {
    name: 'Frank Helen',
    email: 'frankhelen@gmail.com',
    status: 'Wired',
    investment: 900000,
    investmentDate: '12/17/2021',
  },
  {
    name: 'Ginny Cho',
    email: 'ginnycho@gmail.com',
    status: 'Signed',
    investment: 80000,
    investmentDate: '12/17/2021',
  },
  {
    name: 'Harry Burke',
    email: 'zarryburke@gmail.com',
    status: 'Viewed',
    investment: 0,
    investmentDate: '',
  },
  {
    name: 'Susan Dennis',
    email: 'zusandennis@gmail.com',
    status: 'Invited',
    investment: 0,
    investmentDate: '',
  },
  {
    name: 'Zack Gleeson',
    email: 'zackgleeson@gmail.com',
    status: 'Wired',
    investment: 250000,
    investmentDate: '12/17/2021',
  },
  {
    name: 'Zack Gleeson',
    email: 'zackgleeson@gmail.com',
    status: 'Wired',
    investment: 250000,
    investmentDate: '12/17/2021',
  },
];

const Investors: React.FC<Props> = ({ classes }) => {
  const boxSize = 2;
  const containerSpacing = 2;
  const invisibleBoxes = Array(5 - dashboardBoxes.length).fill(0);
  const [currentView, setCurrentView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewChange = (newView: string): void => {
    setCurrentView(newView);
  };

  const getChipStyle = (status: string) => {
    let basicStyle: ChipStyle = {
      fontSize: '12px',
      fontWeight: 500,
      borderRadius: '12px',
      height: '24px',
    };
    switch (status) {
      case 'Invited':
        basicStyle.background = '#F1F5F9';
        basicStyle.color = '#334155';
        return basicStyle;
      case 'Viewed':
        basicStyle.background = '#2A2B54';
        basicStyle.color = '#FFFFFF';
        return basicStyle;
      case 'Signed':
        basicStyle.background = '#ECF3FF';
        basicStyle.color = '#0558E7';
        return basicStyle;
      case 'Wired':
        basicStyle.background = '#D1FAE5';
        basicStyle.color = '#047857';
        return basicStyle;
      default:
        return basicStyle;
    }
  };

  const getCellContent = (type: string, row: any, headerValue: string) => {
    switch (type) {
      case 'investor':
        return (
          <div>
            <p
              className={`${classes.cellValue} ${classes.textTop}`}
              style={{ marginBottom: '4px' }}
            >
              {row.name}
            </p>
            <p className={`${classes.cellValue} ${classes.textBottom}`}>{row.email}</p>
          </div>
        );
      case 'status':
        return (
          <div>
            <Chip label={row.status} style={getChipStyle(row.status)} />
          </div>
        );
      case 'investment':
        return (
          <div>
            <p
              className={`${classes.cellValue} ${classes.textTop}`}
              style={{ marginBottom: '4px' }}
            >
              ${nWithCommas(row.investment)}
            </p>
            <p className={`${classes.cellValue} ${classes.textBottom}`}>{row.investmentDate}</p>
          </div>
        );
      default:
        return <p></p>;
    }
  };

  const getSortedData = (data: Investor[], property: string, order: string) => {
    console.log({ order });
    switch (property) {
      case 'investor':
        return data.sort((a, b) => {
          const _a = a.name ? a.name : a.email;
          const _b = b.name ? b.name : b.email;
          return ('' + (order === 'desc' ? _b : _a)).localeCompare(order === 'desc' ? _a : _b);
        });
      case 'status': {
        const statusOrder: { [key: string]: any } = {
          Invited: 0,
          Viewed: 1,
          Signed: 2,
          Wired: 3,
        };
        return data.sort((a, b) => {
          return order === 'desc'
            ? statusOrder[a.status] - statusOrder[b.status]
            : statusOrder[b.status] - statusOrder[a.status];
        });
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
    ? investorsData.filter((investor) => {
        return `${investor.name}${investor.email}`
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
            InputLabelProps={{
              style: {
                top: '-4px',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              classes: { input: classes.input, root: classes.inputRoot },
            }}
            inputProps={{
              style: {
                padding: '14.5px 14px 14.5px 0',
                background: 'white',
              },
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
      <Grid container spacing={containerSpacing}>
        <Grid item xs={1} />
        <Grid item lg={10}>
          {currentView === 'list' && (
            <NewAllocationsTable
              headers={investorsHeaders}
              getCellContent={getCellContent}
              data={data}
              listOf="investors"
              pagination={true}
              getSortedData={getSortedData}
            />
          )}
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </>
  );
};

export default withStyles(styles)(Investors);
