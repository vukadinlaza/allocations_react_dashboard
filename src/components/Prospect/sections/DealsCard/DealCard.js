import React, { useState } from 'react';
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
import ProgressBar from './ProgressBar';
import DealInfo from './DealInfo';

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

const DealCard = ({ deal }) => {
  console.log('deal==>', deal);
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const viewDeal = () => {
    /* bring in data to go to real deal */
    history.push(`prospects/${deal.deal_organization}/${deal.deal_slug}`);
  };

  return (
    <Grid item xs={12} md={6} lg={3} style={{ display: 'flex', justifyContent: 'center' }}>
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
};

export default DealCard;
