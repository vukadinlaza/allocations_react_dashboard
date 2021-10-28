// import { phone } from '../../utils/helpers';
import { makeStyles } from '@material-ui/core/styles';
import { phone, tablet } from '../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  // * Styles that are used in more than one place in the build form
  root: {
    display: 'flex',
    '& > *': {
      // margin: theme.spacing(1),
      width: '267px',
      height: '166px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#7070703B',
    },
  },
  paper: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    marginBottom: '16px',
    padding: '42px',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    [theme.breakpoints.down(phone)]: {
      maxWidth: '600px',
      marginBottom: '24px',
      padding: '16px',
    },
  },

  docUploadBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    // boxShadow: '0px 3px 6px #00000029',
    // border: '1px solid #7070703B',
    marginBottom: '16px',
    padding: '42px',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    [theme.breakpoints.down(phone)]: {
      maxWidth: '600px',
      marginBottom: '24px',
      padding: '16px',
    },
  },

  buildTabContainer: {
    marginBottom: '16px',
    paddingLeft: '42px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down(phone)]: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: '0',
    },
  },
  formHeaderText: {
    padding: '36px 0px 27px 8px',
    color: '#2A2B54',
    fontSize: '22px',
    [theme.breakpoints.down(phone)]: {
      fontSize: '13px',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    [theme.breakpoints.down(phone)]: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '8px',
    },
  },

  docIconBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '50%',
    width: '58px',
    height: '58px',
  },
  continueButton: {
    font: 'normal normal bold 24px/28px Roboto',
    marginTop: '5px',
    width: '350px',
    height: '60px',
    margin: 'auto',
    background: '#186EFF 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    opacity: '1',
    color: '#FFFFFF',
    textTransform: 'none',
    outline: 'none',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '14px',
      marginTop: '20px',
      marginLeft: '0',
      width: '100%',
    },
  },
  helpIcon: {
    marginLeft: '0.2em',
    cursor: 'pointer',
    color: '#205DF5',
    fontSize: '15px',
  },
  formContainers: {
    width: '100%',
  },
  formItemName: {
    color: '#2A2B54',
    font: 'normal normal bold 17px/20px Roboto',
    marginBottom: '20px',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '14px',
      marginLeft: '8px',
    },
  },
  customFormItemName: {
    minHeight: '40px',
  },
  sectionHeaderText: {
    fontSize: '34px',
    [theme.breakpoints.down(phone)]: {
      fontSize: '24px',
    },
  },
  previousButton: {
    font: 'normal normal normal 24px/28px Roboto',
    marginTop: '11px',
    marginLeft: '135px',
    padding: '5px',
    cursor: 'pointer',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '14px',
      marginTop: '0px',
      marginLeft: '0',
      width: '100%',
      textAlign: 'center',
    },
  },
  cancelIcon: {
    position: 'relative',
    right: '-120px',
    top: '-10px',
    zIndex: 1,
    color: '#4a4a4a',
    cursor: 'pointer',
    transition: '0.5s',
    '&:hover': {
      color: '#e71a1a',
    },
  },
  uploadIcon: {
    color: 'blue',
    transparentheight: '35px',
    [theme.breakpoints.down(phone)]: {
      marginRight: '20px',
      width: '30px',
    },
  },
  uploadIconLabel: {
    display: 'flex',
    justifyContent: 'space-evenly',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  subtitle: {
    textAlign: 'left',
    font: 'normal normal normal 16px/19px Roboto',
    letterSpacing: '0px',
    color: '#186EFF',
    opacity: '1',
    marginBottom: '41px',
  },

  // 1. Styles that are used exclusively in the 'Build your SPV' tab.
  assetTypeRowItem: {
    paddingBottom: '16px',
    paddingRight: '24px',
    [theme.breakpoints.down(phone)]: {
      paddingRight: '0',
    },
  },
  assetChoiceGrid: {
    display: 'flex',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  inputBox: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    borderRadius: '5px',
    padding: '0',
    maxWidth: '568px',
    width: '100%',
  },
  selectInputBox: {
    width: '90%',
  },
  wideInputBox: {
    maxWidth: '1206px',
  },

  inputButton: {
    width: '180px',
    height: '58px',
    background: '#FFFFFF26 0% 0% no-repeat padding-box',
    border: '2px solid #70707080',
    borderRadius: '5px',
    marginRight: '10px',
    opacity: '0.5',
    outline: 'none',
    [theme.breakpoints.down(phone)]: {
      width: '130px',
    },
  },

  selectedInputButton: {
    width: '180px',
    height: '58px',
    background: '#FFFFFF26 0% 0% no-repeat padding-box',
    border: '2px solid red',
    borderRadius: '5px',
    marginRight: '10px',
    opacity: '0.5',
    [theme.breakpoints.down(phone)]: {
      width: '130px',
    },
  },
  inputGridContainer: {
    marginTop: '16px',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
    },
  },
  inputGridItem: {
    // marginBottom: '37px',
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
    },
  },
  customInputGridItem: {
    marginBottom: '37px',
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
    },
  },
  inputGridItemColumn: {
    marginBottom: '37px',
    flexDirection: 'column',
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
    },
  },
  finalInputBox: {
    width: '100%',
    minHeight: '167px',
    maxWidth: '1190px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    border: '1px solid #70707040',
    borderRadius: '5px',
    padding: '0',
    marginBottom: '37px',
  },
  finalInput: {
    width: '100%',
    height: 'auto',
    minHeight: '167px',
    maxWidth: '1190px',
    padding: '0',
  },
  assetItemText: {
    font: 'normal normal normal 18px/21px Roboto',
    color: '#2A2B54',
    letterSpacing: '0px',
    textAlign: 'left',
    opacity: '1',
    [theme.breakpoints.down(phone)]: {
      margin: '0',
    },
  },
  itemText: {
    font: 'normal normal normal 18px/21px Roboto',
    width: '150px',
    textAlign: 'center',
    color: '#2A2B54',
    letterSpacing: '0px',
    opacity: '1',
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
      font: 'normal normal normal 16px/21px Roboto',
    },
  },
  selectorButton: {
    fontSize: '.8em',
    color: 'black',
    height: '60px',
    border: '1px solid #d3d3d3 !important',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down(phone)]: {
      fontSize: '.7em',
    },
  },
  uploadDocItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    background: '#ECF3FF 0% 0% no-repeat padding-box',
    border: '2px dashed #0461FF !important',
    borderRadius: '10px',
    opacity: 1,
    width: '280px',
    height: '236px',
    marginBottom: '8px',
  },
  selected: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    background: '#fff 0% 0% no-repeat padding-box !important',
    boxShadow: '0px 3px 6px #0000000D !important',
    border: '2px solid lightgrey !important',
    opacity: '1 !important',
  },
  typeItem: {
    padding: '12px',
    width: '100%',
    height: '166px',
    minHeight: '166px',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000D',
    border: '2px solid #2A2B5480',
    borderRadius: '10px',
    cursor: 'pointer',
    [theme.breakpoints.down(phone)]: {
      width: '311px',
    },
    '& *': {
      pointerEvents: 'none',
    },
  },
  subText: {
    textAlign: 'left',
    font: 'normal normal normal 12px/14px Roboto',
    paddingBottom: '5px',
    letterSpacing: '0px',
    color: '#186EFF',
    width: '202px',
    opacity: 1,
  },
  // 1. (FUND) Styles that are used exclusively in the 'Build your SPV' tab.
  // 2. Styles that are used exclusively in the 'Review and sign terms' tab.
  uploadContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '1000px',
    minWidth: '900px',
  },
  uploadDocItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    background: '#ECF3FF 0% 0% no-repeat padding-box',
    border: '2px dashed #0461FF !important',
    borderRadius: '10px',
    opacity: 1,
    width: '280px',
    height: '236px',
    marginBottom: '8px',
  },
  uploadedDocItem: {
    background: '#f6f7f8 0% 0% no-repeat padding-box',
  },
  deleteDocButton: {
    cursor: 'pointer',
    backgroundColor: 'inherit',
    border: 'none',
    outline: 'none',
  },
  checkCircle: {
    opacity: '0.3',
    transparentheight: '35px',
    width: '38px',
    marginLeft: 'auto',
    marginRight: '37px',
    [theme.breakpoints.down(phone)]: {
      marginRight: '20px',
      width: '30px',
    },
  },
  icon: {
    opacity: '1',
  },
  sectorTag: {
    display: 'flex',
    color: '#0461ff',
    backgroundColor: '#DAE8FF',
    fontSize: '85%',
    margin: '3px',
    height: '25px',
    paddingLeft: '6px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    borderRadius: '4px',
    alignItems: 'center',
  },
  removeSectorButton: {
    display: 'flex',
    height: '100%',
    marginLeft: '3px',
    alignItems: 'center',
    color: '#0461ff',
    backgroundColor: '#DAE8FF',
    border: 'none',
    borderRadius: '0px 4px 4px 0px',
    fontWeight: '600',
    fontSize: '10px',
    //* TO DO: fix on hover - need to fit height
    '&:hover': {
      backgroundColor: '#FFBDAD',
      color: '#DE350B',
    },
  },
  // 3. Styles that are used exclusively in the 'Upload docs' tab.
  finishButton: {
    font: 'normal normal bold 24px/28px Roboto',
    marginTop: '44px',
    width: '368px',
    height: '68px',
    background: '#39C522 0% 0% no-repeat padding-box',
    borderRadius: '10px',
    color: '#FFFFFF',
    textTransform: 'none',
    outline: 'none',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '14px',
      marginTop: '20px',
      marginLeft: '0',
      width: '100%',
    },
    '&:hover': {
      backgroundColor: '#fff',
      color: '#3c52b2',
    },
  },
}));

export default useStyles;
