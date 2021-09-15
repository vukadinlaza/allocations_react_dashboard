import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Avatar, Badge } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(13),
    height: theme.spacing(13),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  },
}));

const ProfilePhoto = ({ investor }) => {
  const classes = useStyles();
  const SmallAvatar = withStyles((theme) => ({
    root: {
      width: 22,
      height: 22,
      border: `2px solid ${theme.palette.background.paper}`,
      backgroundColor: theme.palette.primary.main,
    },
  }))(Avatar);

  const EditAvatar = withStyles(() => ({
    root: {
      width: 17,
      height: 17,
    },
  }))(EditIcon);

  return (
    <Badge
      overlap="circular"
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      badgeContent={
        <SmallAvatar alt="Edit">
          <EditAvatar />
        </SmallAvatar>
      }
    >
      <Avatar
        alt="avatar"
        src={`https://allocations-user-img.s3.us-east-2.amazonaws.com/${investor.profileImageKey}`}
        style={{ border: 'solid blue 3px' }}
        className={classes.avatar}
      />
    </Badge>
  );
};

export default ProfilePhoto;
