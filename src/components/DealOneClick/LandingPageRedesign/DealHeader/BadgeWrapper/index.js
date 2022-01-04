import React from 'react';
import { Badge, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CameraAltOutlined } from '@material-ui/icons';
import { useDealPage } from '../../../../dashboard/FundManagerDashboard/sections/DealPage/DealPageContext';

const StyledBox = withStyles({
  root: {
    cursor: 'pointer',
    '&:hover': {
      background: '#ECF3FF',
    },
    '&:focus': {
      border: '1px solid #186EFF',
      color: '#186EFF;',
    },
  },
})(Box);

export default function BadgeWrapper({ children, handleClick, ...props }) {
  const { isEdit } = useDealPage();

  if (isEdit) {
    return (
      <Badge
        overlap="circular"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        badgeContent={
          <StyledBox
            bgcolor="white"
            borderRadius="50%"
            border="1px solid #CBD5E1"
            p="4px"
            color="#64748B"
            onClick={handleClick}
          >
            <CameraAltOutlined style={{ fontSize: 16 }} />
          </StyledBox>
        }
        {...props}
      >
        {children}
      </Badge>
    );
  }
  return children;
}
