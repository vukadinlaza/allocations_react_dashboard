import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  errButton: {
    width: '381px',
    height: '59px',
    background: `${theme.colors.primary[500]} 0% 0% no-repeat padding-box`,
    font: 'normal normal bold 22px/25px Roboto',
    borderRadius: '5px',
    opacity: 1,
  },
  errHeader: {
    paddingTop: '50px',
    font: 'normal normal bold 60px/71px Roboto',
    letterSpacing: '0px',
    color: theme.colors.black[50],
    opacity: 1,
  },
  errPage: {
    zIndex: 10,
    textAlign: 'center',
  },
  errText: {
    font: 'normal normal normal 19px/23px Roboto',
    letterSpacing: '0px',
    color: theme.colors.black[50],
    opacity: 1,
    paddingBottom: '50px',
  },
}));

export default styles;
