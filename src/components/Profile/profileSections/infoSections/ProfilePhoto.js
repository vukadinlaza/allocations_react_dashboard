import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Avatar, Badge, Grid, TextField, Button } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';
import EditIcon from '@material-ui/icons/Edit';
import AppModal from '../../../Modal/AppModal';

const PROFILE_IMAGE = gql`
  mutation UpdateProfileImage($email: String!, $image: Upload!) {
    updateProfileImage(email: $email, image: $image) {
      _id
      email
      profileImageKey
    }
  }
`;

const DELETE_PROFILE_IMAGE = gql`
  mutation DeleteProfileImage($email: String!, $profileImageKey: String!) {
    deleteProfileImage(email: $email, profileImageKey: $profileImageKey) {
      _id
      profileImageKey
      email
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  },
}));

const ProfilePhoto = ({ investor, refetchUser }) => {
  const classes = useStyles();
  const [showModal, setShowModal] = useState(false);
  const imageInDatabase = `https://allocations-user-img.s3.us-east-2.amazonaws.com/${investor.profileImageKey}`;
  const [image, setImage] = useState('');
  const [fileToImage, setFileToImage] = useState('');

  const fileToDataUri = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });

  const convertFileToImage = (file) => {
    if (!file) {
      setFileToImage('');
      return;
    }
    setImage(file);
    fileToDataUri(file).then((fileToImage) => {
      setFileToImage(fileToImage);
    });
  };

  const [uploadImage] = useMutation(PROFILE_IMAGE, {
    onCompleted: () => {
      toast.success('Success! Profile updated');
      refetchUser();
      setShowModal(false);
      setImage(imageInDatabase);
      setFileToImage('');
    },
    onError: () => {
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com');
    },
  });

  const [deleteProfileImage] = useMutation(DELETE_PROFILE_IMAGE, {
    onCompleted: () => {
      toast.success('Success! Image deleted');
      setImage('');
      setFileToImage('');
      refetchUser();
      setShowModal(false);
    },
    onError: () => {
      toast.error('Sorry, something went wrong. Try again or contact support@allocations.com');
    },
  });

  const handleDelete = () => {
    deleteProfileImage({ variables: { email: investor.email, profileImageKey: image } });
  };

  const handleSubmit = async () => {
    uploadImage({
      variables: { email: investor.email, image },
    });
  };

  const onClose = () => {
    setShowModal(false);
    setFileToImage('');
  };

  const SmallAvatar = withStyles((theme) => ({
    root: {
      width: 22,
      height: 22,
      border: `2px solid ${theme.palette.background.paper}`,
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: '#56db40',
        cursor: 'pointer',
      },
    },
  }))(Avatar);

  const EditAvatar = withStyles(() => ({
    root: {
      width: 15,
      height: 15,
    },
  }))(EditIcon);

  return (
    <>
      <Badge
        overlap="circular"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        badgeContent={
          <SmallAvatar alt="Edit" onClick={() => setShowModal(!showModal)}>
            <EditAvatar />
          </SmallAvatar>
        }
      >
        <Avatar
          alt="avatar"
          src={!investor.profileImageKey ? '' : imageInDatabase}
          style={{ border: 'solid blue 3px' }}
          className={classes.avatar}
        >
          Add Image
        </Avatar>
      </Badge>

      <AppModal isOpen={showModal} onClose={onClose} modalHeader="Upload Profile Photo">
        <Grid container justifyContent="center" alignItems="center" spacing={3}>
          <Grid item xs={6} style={{ textAlign: 'center', width: '100%' }}>
            <TextField
              variant="outlined"
              onChange={(event) => convertFileToImage(event.target.files[0] || null)}
              type="file"
            />
          </Grid>

          <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Avatar
              alt="avatar"
              src={
                !fileToImage && !investor.profileImageKey
                  ? ''
                  : !fileToImage
                  ? imageInDatabase
                  : fileToImage
              }
              className={classes.avatar}
              style={{ textAlign: 'center' }}
            >
              Add Image
            </Avatar>
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Grid>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              style={{ backgroundColor: 'red', color: 'white' }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </AppModal>
    </>
  );
};

export default ProfilePhoto;
