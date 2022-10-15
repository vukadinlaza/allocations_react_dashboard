import { makeStyles } from '@material-ui/core/styles';
import { phone, laptop, smallLaptop } from '../../../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  bigBox: {
    height: '342px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
    padding: '80px 24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '56px',
    opacity: '0.8',
  },
  bigBoxTitle: {
    fontWeight: 500,
    fontSize: '16px',
    color: theme.colors.gray[400],
  },
  boxTitle: {
    fontWeight: 500,
    fontSize: '16px',
    color: theme.colors.gray[500],
  },
  boxValue: {
    fontWeight: 700,
    fontSize: '44px',
    color: theme.colors.black[50],
    [theme.breakpoints.down(laptop)]: {
      fontSize: '32px',
    },
    [theme.breakpoints.down(smallLaptop)]: {
      fontSize: '24px',
    },
    [theme.breakpoints.down(phone)]: {
      fontSize: '16px',
    },
  },
  smallBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
    padding: '9px 12px',
  },
}));

export default useStyles;
