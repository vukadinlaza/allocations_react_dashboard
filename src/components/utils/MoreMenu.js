import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = (theme) => ({
  menu: {
    '& li': {
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: 'rgb(32,93,245,0.05)',
      },
    },
  },
  moreButton: {
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
});

const MoreMenu = ({ classes, menuItems, align = 'center' }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMore = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root} style={{ justifyContent: align }}>
      <MoreVertIcon
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMore}
        className={classes.moreButton}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}
      >
        {menuItems.map((item, idx) => (
          <MenuItem
            disabled={item.disabled}
            key={`item-${idx}`}
            onClick={() => {
              item.onItemClick({ ...item.clickArgs });
              handleClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default withStyles(styles)(MoreMenu);
