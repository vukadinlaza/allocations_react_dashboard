import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  avatar: {
    marginTop: 108,
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
  profileSection: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: 30,
      marginRight: 30,
    },
    [theme.breakpoints.up('md')]: {
      marginLeft: 160,
      marginRight: 160,
    },
  },
  profileSectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 100,
  },
}));

export default useStyles;
