import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  bankWarning: {
    color: '#856404',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeeba',
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
    '& h4': { textAlign: 'center', color: '#5a5a5a', marginBottom: '20px' },
  },
  dealDataRoom: {
    padding: '25px',
    '&>span': {
      display: 'inline-block',
      backgroundColor: '$softblue',
      padding: '10px 15px',
      fontSize: '1.2em',
      marginRight: '10px',
    },
  },
  dealLead: {
    padding: '10px 15px',
    fontSize: '1.3em',
    color: '#333',
    '& span': { paddingLeft: '15px' },
  },
  dealMemo: {
    margin: '25px 0px 10px 0px',
    padding: '15px',
    borderRadius: '5px',
    fontSize: '1.1em',
    backgroundColor: '$softblue',
  },
  dealParams: {
    marginTop: '10px',
    padding: '10px',
    '&>div': {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 0px',
      borderBottom: '1px dotted lightgray',
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
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
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
  faClock: { color: '#ffc107' },
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
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
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
    backgroundColor: '$green',
    color: '#fff',
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
    color: '#404040',
    backgroundColor: '#eaeffc',
  },
  investmentOnboarded: {
    backgroundColor: '$brandblue',
    color: '#fff',
  },
  investmentPledged: {
    backgroundColor: '#ffc107',
    color: '#333',
  },
  investmentStatus: {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '3px',
    verticalAlign: 'top',
  },
  investorDetails: {
    margin: '10px 0px',
    '&>div': { marginBottom: '5px', '& input': { color: '#333' } },
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
    backgroundColor: '$graygreen',
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
    backgroundColor: '$softgreen',
  },
  pledgeLink: {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    padding: '10px 25px',
    margin: '25px 40px',
    fontSize: '1.3em',
    textAlign: 'center',
    '& a': { marginLeft: '15px', color: '#333' },
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
    color: '#721c24',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
  },
  smallHeader: {
    textAlign: 'left',
    color: '#5a5a5a',
  },
  step: {
    display: 'inline-block',
    padding: '10px 20px',
    color: '#a7a7a7',
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      padding: '6px 12px',
    },
  },
  stepActive: {
    backgroundColor: '$brandblue',
    color: '#fff',
  },
  stepDataRoom: {
    border: '1px solid #a7a7a7',
    borderRadius: '5px 0px 0px 5px',
    marginRight: '-1px',
  },
  stepOnboard: {
    borderTop: '1px solid #a7a7a7',
    borderBottom: '1px solid #a7a7a7',
  },
  stepPledge: {
    border: '1px solid #a7a7a7',
    marginRight: '-1px',
  },
  stepWire: {
    border: '1px solid #a7a7a7',
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
      color: '$softgreen !important',
    },
  },
  waiting: {
    margin: '10px 30px',
    textAlign: 'center',
    fontSize: '1.3em',
    color: '#333',
    backgroundColor: '#fcfcfc',
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
    backgroundColor: '#f9fbfb',
  },
  divider: {
    margin: '16px -16px',
  },
  tabs: {
    borderTop: '1px solid #dfe3e9',
    borderBottom: '1px solid #dfe3e9',
    background: '#f7f9fa',
    minHeight: 44,
    margin: '40px 0',
  },
  text: {
    color: '#7f8ea3',
  },
  tab: {
    height: 75,
    width: '100%',
  },
  activeTab: {
    height: 75,
    width: '100%',
    borderBottom: '3px solid #205DF5',
    outline: '0 !important',
  },
  button: {
    margin: '.5rem',
  },
}));

export default useStyles;
