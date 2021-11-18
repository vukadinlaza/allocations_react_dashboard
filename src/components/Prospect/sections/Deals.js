import React from 'react';
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Grid,
  MenuItem,
  Menu,
  ListItemIcon,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { FiMoreVertical, FiSettings } from 'react-icons/fi';
import { makeStyles } from '@material-ui/core/styles';
import ProgressBar from './DealsSections/ProgressBar';
import DealInfo from './DealsSections/DealInfo';

const useStyles = makeStyles((theme) => ({
  mainCard: {
    maxWidth: '250px',
  },
  dealLogo: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  settingsButton: {
    outline: 'none',
    '&:active': {
      outline: 'none',
    },
    '&:focus': {
      outline: 'none',
    },
  },
}));

const allDeals = [
  {
    deal_name: 'Passtur',
    deal_image: '',
    deal_max_allocation: 750000,
    deal_raised_amount: 420000,
    deal_total_pledges: 13,
    deal_days_left_to_pledge: 7,
    deal_stage: 'Seed 3',
    deal_sectors: ['Crypto', 'Real Estate', 'Human Resources'],
  },
  {
    deal_name: 'SpaceX',
    deal_image: '',
    deal_max_allocation: 130000,
    deal_raised_amount: 31000,
    deal_total_pledges: 8,
    deal_days_left_to_pledge: 27,
    deal_stage: 'Seed',
    deal_sectors: ['Crypto', 'Space', 'Human Resources'],
  },
  {
    deal_name: 'Biggie',
    deal_image: '',
    deal_max_allocation: 300000,
    deal_raised_amount: 950000,
    deal_total_pledges: 21,
    deal_days_left_to_pledge: 3,
    deal_stage: 'Pre-Seed',
    deal_sectors: ['Crypto', 'Real Estate', 'Human Resources'],
  },
  {
    deal_name: 'Aardvark',
    deal_image: '',
    deal_max_allocation: 950000,
    deal_raised_amount: 630000,
    deal_total_pledges: 19,
    deal_days_left_to_pledge: 13,
    deal_stage: 'Seed 1',
    deal_sectors: ['Crypto', 'AI'],
  },
];

const Deals = () => {
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const viewDeal = () => {
    /* bring in data to go to real deal */
    history.push('prospects/aardvark/aardvark');
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      {allDeals.map((deal) => {
        return (
          <Grid
            item
            xs={12}
            md={6}
            lg={3}
            key={deal.deal_name}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card className={classes.mainCard} variant="outlined">
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  aria-label="settings"
                  onClick={handleClick}
                  className={classes.settingsButton}
                >
                  <FiMoreVertical />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={viewDeal}>
                    <ListItemIcon>
                      <FiSettings />
                    </ListItemIcon>
                    View Deal
                  </MenuItem>
                </Menu>
              </div>
              <CardHeader
                style={{ marginTop: '-1rem' }}
                avatar={
                  <Avatar className={classes.dealLogo} aria-label="deal logo">
                    logo
                  </Avatar>
                }
                titleTypographyProps={{ variant: 'subtitle1' }}
                classes={{
                  title: classes.cardTitle,
                }}
                title={deal.deal_name}
              />
              <ProgressBar deal={deal} />
              <DealInfo deal={deal} />
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Deals;
