import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  bigBox: {
    height: '342px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
    padding: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    fontSize: '40px',
    color: theme.colors.black[50],
  },
  smallBox: {
    height: '116px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
    padding: '18px 24px',
  },
}));

export default useStyles;
