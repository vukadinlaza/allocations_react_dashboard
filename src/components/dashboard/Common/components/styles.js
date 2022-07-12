import { makeStyles } from '@material-ui/core/styles';
import { phone } from '../../../../utils/helpers';

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
    fontSize: '2.5vw',
    color: theme.colors.black[50],
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
    padding: '18px 24px',
  },
}));

export default useStyles;
