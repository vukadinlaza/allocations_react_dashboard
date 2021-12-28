import React from 'react';
import { Badge, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { CameraAltOutlined } from '@material-ui/icons';

const StyledBox = withStyles({
  root: {
    '&:hover': {
      background: '#ECF3FF',
    },
    '&:focus': {
      border: '1px solid #186EFF',
      color: '#186EFF;',
    },
  },
})(Box);

export default function BadgeWrapper({ isEdit, children }) {
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
          >
            <CameraAltOutlined style={{ fontSize: 16 }} />
          </StyledBox>
        }
      >
        {children}
      </Badge>
    );
  }
  return children;
}
