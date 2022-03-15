import { phone } from '../../../utils/helpers';

const styles = (theme) => ({
  box: {
    marginBottom: '20px',
  },
  buttonsContainer: {
    display: 'flex',
  },
  buttonLabel: {
    width: 'auto',
  },
  chart: {
    maxWidth: '48%',
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      overflowX: 'scroll',
      maxWidth: '100%',
      marginBottom: '44px',
    },
  },
  chartBox: {
    borderRadius: '8px',
    boxShadow: 'none !important',
    padding: '18px 24px',
    height: '302px',
    marginTop: '32px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  computerBoxes: {
    [theme.breakpoints.down(phone)]: {
      display: 'none',
    },
  },
  doughnut: {
    width: '60%',
  },
  list: {
    maxWidth: '100%',
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      overflowX: 'scroll',
      maxWidth: '100%',
      marginBottom: '44px',
    },
  },
  listsContainer: {
    marginTop: '50px',
  },
  listLink: {
    cursor: 'pointer',
  },
  listTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  mainContainer: {
    marginBottom: '100px',
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100vw',
    },
  },
  mobileBoxes: {
    [theme.breakpoints.up(phone)]: {
      display: 'none',
    },
  },
  nameEmail: {
    display: 'flex',
    flexDirection: 'column',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  tableContainer: {
    maxWidth: 'calc(100vw - 300px)',
    minWidth: '175px',
    [theme.breakpoints.down(phone)]: {
      maxWidth: 'none',
      width: '100%',
    },
  },
  titleContainer: {
    margin: '48px 0 24px 0',
  },
});

export default styles;
