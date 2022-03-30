import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  capitalAccount: {
    position: 'relative',
  },
  capitalAccountTable: {
    verticalAlign: 'top',
    width: '40%',
    margin: '10px 0px',
    display: 'inline-block',
  },
  capitalAccountPie: {
    verticalAlign: 'top',
    height: '300px',
    width: '60%',
    display: 'inline-block',
  },
}));

export default useStyles;
