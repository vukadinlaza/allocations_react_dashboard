import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  bankWarning: {
    color: theme.colors.warning[800],
    backgroundColor: theme.colors.warning[100],
    border: `1px solid ${theme.colors.warning[200]}`,
  },
  banner: {
    minWidth: '100%',
    minHeight: '1.3rem',
    fontSize: '0.9rem',
    margin: '0.3rem',
    borderRadius: '0.25rem',
    padding: '0.25rem',
    marginBottom: '0.5rem',
  },
  closingDate: {
    padding: '10px 15px',
    fontSize: '1.2em',
    '&>span': { paddingLeft: '10px' },
    marginBottom: '15px',
  },
  cryptoWire: {
    padding: '10px',
    fontSize: '1.1em',
  },
  deal: {
    '& h2': { textAlign: 'center', marginBottom: '25px' },
    '& h4': { textAlign: 'center', color: theme.colors.gray[600], marginBottom: '20px' },
  },
  dealDataRoom: {
    padding: '25px',
    '&>span': {
      display: 'inline-block',
      backgroundColor: theme.colors.primary[100],
      padding: '10px 15px',
      fontSize: '1.2em',
      marginRight: '10px',
    },
  },
  dealLead: {
    padding: '10px 15px',
    fontSize: '1.3em',
    color: theme.colors.gray[700],
    '& span': { paddingLeft: '15px' },
  },
  dealMemo: {
    margin: '25px 0px 10px 0px',
    padding: '15px',
    borderRadius: '5px',
    fontSize: '1.1em',
    backgroundColor: theme.colors.primary[100],
  },
  dealParams: {
    marginTop: '10px',
    padding: '10px',
    '&>div': {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 0px',
      borderBottom: `1px dotted ${theme.colors.gray[300]}`,
    },
  },
  documentIframe: {
    textAlign: 'center',
    padding: '10px 20px',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      padding: '0px 0px',
    },
  },
  editBtn: {
    margin: '10px',
  },
  embedResponsive: {
    boxShadow: `0 4px 8px 0 ${theme.colors.black[100]}33`,
    position: 'relative',
    display: 'block',
    width: '100%',
    padding: '0',
    overflow: 'hidden',
    '&::before': {
      display: 'block',
      content: '""',
    },
  },
  embedResponsive1by1: {
    '&::before': {
      paddingTop: '100%',
    },
  },
  embedResponsiveItem: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    width: '100%',
    height: '100%',
    border: '0',
  },
  externalSignLink: {
    textAlign: 'center',
    paddingBottom: '15px',
    fontSize: '1.3em',
  },
  faClock: { color: theme.colors.warning[400] },
  fileLabel: { marginRight: '10px' },
  flow: {
    padding: '10px 0px',
    [theme.breakpoints.down('xs')]: {
      padding: '0px 0px 5px 0px',
    },
  },
  flowSteps: {
    textAlign: 'center',
    padding: '10px 0px',
  },
  hide: {
    display: 'none',
  },
  iframeContainer: {
    overflow: 'hidden',
    paddingTop: '56.25%',
    position: 'relative',
    boxShadow: `0 4px 8px 0 ${theme.colors.black[100]}33`,
    '& iframe': {
      border: '0',
      height: '100%',
      left: '0',
      position: 'absolute',
      top: '0',
      width: '100%',
    },
  },
  investmentAmount: {
    display: 'inline-block',
    fontSize: '2em',
    paddingRight: '10px',
  },
  investmentComplete: {
    backgroundColor: theme.colors.success[500],
    color: theme.colors.white[100],
  },
  investmentFlow: {
    [theme.breakpoints.down('xs')]: {
      padding: '0px',
      boxShadow: 'none',
    },
  },
  investmentInvited: {
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: '1.1em',
    color: theme.colors.gray[700],
    backgroundColor: theme.colors.primary[100],
  },
  investmentOnboarded: {
    backgroundColor: theme.colors.primary[500],
    color: theme.colors.white[100],
  },
  investmentPledged: {
    backgroundColor: theme.colors.warning[400],
    color: theme.colors.gray[700],
  },
  investmentStatus: {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '3px',
    verticalAlign: 'top',
  },
  investorDetails: {
    margin: '10px 0px',
    '&>div': { marginBottom: '5px', '& input': { color: theme.colors.gray[700] } },
  },
  kyc: {
    padding: '20px 50px',
    margin: '0px 25px',
    '&>div': { padding: '5px 0px' },
  },
  keycCheck: {
    textAlign: 'center',
  },
  noPledges: {
    backgroundColor: theme.colors.success[50],
    '& p': { padding: '10px 10px 0px 10px' },
  },
  paperContainer: {
    minWidth: '100%',
  },
  pledgeAmount: {
    margin: '0px 5px',
  },
  pledgeBtn: {
    margin: '10px 5px',
    backgroundColor: theme.colors.success[400],
  },
  pledgeLink: {
    boxShadow: `0 4px 8px 0 ${theme.colors.black[100]}33`,
    borderRadius: '5px',
    padding: '10px 25px',
    margin: '25px 40px',
    fontSize: '1.3em',
    textAlign: 'center',
    '& a': { marginLeft: '15px', color: theme.colors.gray[700] },
  },
  pledgesTable: {
    display: 'inline-block',
    width: '25%',
    verticalAlign: 'top',
    maxHeight: '200px',
    overflow: 'scroll',
    '& td': { textAlign: 'right' },
  },
  pledgesViz: { height: '200px' },
  pledgesVizWrapper: {
    display: 'inline-block',
    width: '70%',
    marginRight: '0%',
    padding: '0px',
  },
  pledging: {
    textAlign: 'center',
  },
  sameUserWarning: {
    color: theme.colors.warning[900],
    backgroundColor: theme.colors.warning[100],
    border: `1px solid ${theme.colors.warning[200]}`,
  },
  smallHeader: {
    textAlign: 'left',
    color: theme.colors.gray[600],
  },
  step: {
    display: 'inline-block',
    padding: '10px 20px',
    color: theme.colors.gray[400],
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      padding: '6px 12px',
    },
  },
  stepActive: {
    backgroundColor: theme.colors.primary[500],
    color: theme.colors.white[100],
  },
  stepDataRoom: {
    border: `1px solid ${theme.colors.gray[400]}`,
    borderRadius: '5px 0px 0px 5px',
    marginRight: '-1px',
  },
  stepOnboard: {
    borderTop: `1px solid ${theme.colors.gray[400]}`,
    borderBottom: `1px solid ${theme.colors.gray[400]}`,
  },
  stepPledge: {
    border: `1px solid ${theme.colors.gray[400]}`,
    marginRight: '-1px',
  },
  stepWire: {
    border: `1px solid ${theme.colors.gray[400]}`,
    borderRadius: '0px 5px 5px 0px',
    marginLeft: '-0px',
  },
  tempLoader: {
    position: 'absolute',
    top: '150px',
    width: '100%',
    zIndex: 1000,
  },
  total: {
    '& td': {
      color: `${theme.colors.success[400]} !important`,
    },
  },
  waiting: {
    margin: '10px 30px',
    textAlign: 'center',
    fontSize: '1.3em',
    color: theme.colors.gray[700],
    backgroundColor: theme.colors.primary[25],
  },
  wire: {
    textAlign: 'center',
  },
  wireLink: {
    [theme.breakpoints.down('xs')]: {
      margin: '5px 10px',
    },
  },

  paper: {
    padding: theme.spacing(2),
    backgroundColor: theme.colors.primary[25],
  },
  divider: {
    margin: '16px -16px',
  },
  tabs: {
    borderTop: `1px solid ${theme.colors.gray[200]}`,
    borderBottom: `1px solid ${theme.colors.gray[200]}`,
    background: theme.colors.gray[50],
    minHeight: 44,
    margin: '40px 0',
  },
  text: {
    color: theme.colors.gray[400],
  },
  tab: {
    height: 75,
    width: '100%',
  },
  activeTab: {
    height: 75,
    width: '100%',
    borderBottom: `3px solid ${theme.colors.primary[600]}`,
    outline: '0 !important',
  },
  button: {
    margin: '.5rem',
  },
}));

export default useStyles;
