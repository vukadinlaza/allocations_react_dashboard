import { makeStyles } from '@material-ui/core/styles';
import { phone } from '../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  // * Styles that are used in more than one place in the build form
  root: {
    display: 'flex',
    '& > *': {
      width: '267px',
      height: '166px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#7070703B',
    },
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
  finalInput: {
    width: '100%',
    height: 'auto',
    minHeight: '167px',
    maxWidth: '1190px',
    padding: '0',
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
  formContainers: {
    width: '100%',
  },
  formItemName: {
    color: '#2A2B54',
    font: 'normal normal bold 17px/20px Roboto',
    marginBottom: '20px',
    borderRadius: '8px',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '14px',
      marginLeft: '8px',
    },
  },
  helpIcon: {
    marginLeft: '0.2em',
    cursor: 'pointer',
    color: '#205DF5',
    fontSize: '15px',
  },
  icon: {
    opacity: '1',
  },
  inputBox: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    borderRadius: '8px !important',
    padding: '0',
    maxWidth: '568px',
    width: '100%',
  },
  inputGridContainer: {
    marginTop: '16px',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
    },
  },
  inputGridItem: {
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
    },
  },
  inputLabelWithTooltip: {
    display: 'flex',
    '& svg': {
      marginTop: '0.2em',
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
  paper: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    marginBottom: '16px',
    borderRadius: '15px',
    padding: '42px',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    [theme.breakpoints.down(phone)]: {
      maxWidth: '600px',
      marginBottom: '24px',
      padding: '16px',
      paddingBottom: '30px',
    },
  },
  previousButton: {
    font: 'normal normal normal 24px/28px Roboto',
    marginTop: '11px',
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
  sectionHeaderText: {
    fontSize: '34px',
    [theme.breakpoints.down(phone)]: {
      fontSize: '24px',
    },
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
  selected: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    color: '#186EFF',
    background: '#ECF3FF 0% 0% no-repeat padding-box !important',
    boxShadow: '0px 3px 6px #0000000D !important',
    border: '2px solid #186EFF !important',
    borderRadius: '8px !important',
    textTransform: 'capitalize',
    opacity: '1 !important',
  },
  selectorButton: {
    fontSize: '.8em',
    color: '#8E9394',
    height: '60px',
    border: '1px solid #d3d3d3 !important',
    backgroundColor: '#ffffff',
    borderRadius: '8px !important',
    textTransform: 'capitalize',
    [theme.breakpoints.down(phone)]: {
      fontSize: '.7em',
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
  typeItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: '12px',
    width: '100%',
    height: '166px',
    minHeight: '166px',
    background: '#EBEBEB 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000D',
    border: '2px solid #E5E5E5',
    borderRadius: '10px',
    cursor: 'pointer',
    [theme.breakpoints.down(phone)]: {
      width: '311px',
    },
    '& *': {
      pointerEvents: 'none',
    },
  },
  typeItemDiv: {
    width: 'inherit',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeItemSelected: {
    extend: 'selected',
    textTransform: 'inherit',
    border: '2px solid #186EFF !important',
    background: '#ECF3FF 0% 0% no-repeat padding-box !important',
  },
  unfilledField: {
    border: '1px solid red',
  },
  // * Styles that are only used in the SPV form
  cryptoFieldset: {
    border: 'solid 1px #186EFF',
    borderTopColor: '#186EFF',
    borderRadius: '8px',
    boxSizing: 'border-box',
    width: 'inherit',
    paddingLeft: '10px',
  },
  cryptoFormContainer: {
    width: '98%',
    right: '1vw',
  },
  cryptoLabel: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#2A2B54',
    width: 'fit-content',
    padding: '0px 5px',
    marginLeft: '5px',
  },
  cryptoSelector: {
    width: '110%',
    padding: '8px 11px 17px 5px',
  },
  customInputGridItem: {
    marginBottom: '37px',
    [theme.breakpoints.down(phone)]: {
      maxWidth: '100%',
    },
  },
  minimumInput: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    // border radius is not taking
    borderRadius: '8px !important',
    padding: '0',
    maxWidth: '464px',
    width: '100%',
  },
  pitchDeckCheckbox: {
    paddingLeft: '0px',
    height: '24px',
    width: '24px',
    borderRadius: '4px',
  },
  pitchDeckColorSecondary: {
    color: '#39C522',
  },
  selectInputBox: {
    width: '90%',
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderRadius: '8px !important',
    },
  },
  // * Styles that are only used in the AgreementSigner.
  agreementSignedBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100px',
    paddingLeft: '30px',
    paddingRight: '30px',
    border: 'none !important',
    borderRadius: '20px',
    boxShadow: 'none !important',
    backgroundColor: '#F6F7F8',
  },
  agreementUnsignedBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100px',
    paddingLeft: '30px',
    paddingRight: '30px',
    border: '2px dashed #0461FF !important',
    borderRadius: '20px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  buttonBox: {
    margin: 'auto',
    marginTop: '40px',
    alignSelf: 'center',
    textAlign: 'center',
  },
  customFormItemName: {
    minHeight: '40px',
  },
  notSigned: {
    backgroundColor: '#FFBDAD',
    color: '#DE350B',
    fontWeight: '600',
    borderRadius: '20px',
    padding: '5px 20px',
  },
  serviceAgreementIconBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#ECF3FF',
  },
  signContainer: {
    display: 'grid',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    marginBottom: '16px',
    borderRadius: '15px',
    padding: '42px',
    width: '100%',
    maxWidth: '1352px',
    gridGap: '30px',
    opacity: 1,
    [theme.breakpoints.down(phone)]: {
      maxWidth: '600px',
      marginBottom: '24px',
      padding: '16px',
      paddingBottom: '30px',
    },
  },
  signed: {
    backgroundColor: 'rgb(57,197,34, 0.23)',
    color: '#34AF1F',
    fontWeight: '600',
    borderRadius: '20px',
    padding: '5px 20px',
  },
  subtitle: {
    textAlign: 'left',
    font: 'normal normal normal 16px/19px Roboto',
    letterSpacing: '0px',
    color: '#186EFF',
    opacity: '1',
    marginBottom: '41px',
  },
  // * Styles that are only used in the 'Upload Docs' tab.
  blueCheck: {
    width: '26px',
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50%',
    justifyContent: 'center',
    backgroundColor: '#0461ff',
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
  deleteDocButton: {
    cursor: 'pointer',
    backgroundColor: 'inherit',
    border: 'none',
    outline: 'none',
  },
  docErrorIconBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2CECC',
    borderRadius: '50%',
    width: '58px',
    height: '58px',
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
  docUploadBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    marginBottom: '16px',
    paddingTop: '20px',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    [theme.breakpoints.down(phone)]: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '600px',
      padding: '23px',
      paddingBottom: '0px',
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
  uploadContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '1000px',
    minWidth: '900px',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
      height: '800px',
    },
  },
  uploadDocLoader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ECF3FF 0% 0% no-repeat padding-box',
    border: '2px dashed #0461FF !important',
    borderRadius: '10px',
    width: '280px',
    height: '236px',
    marginBottom: '8px',
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
    background: '#fff 0% 0% no-repeat padding-box',
    border: '2px solid lightgrey !important',
  },
  uploadErrorLabel: {
    display: 'flex',
    justifyContent: 'space-evenly',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    color: '#8E9394',
  },
  uploadErrorItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    background: '#fff 0% 0% no-repeat padding-box',
    border: '2px solid #EBEBEB !important',
    borderRadius: '10px',
    opacity: 1,
    width: '280px',
    height: '236px',
    marginBottom: '8px',
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
  // 1. Styles that are used exclusively in the 'Type Selector' tab.
  assetChoiceGrid: {
    display: 'flex',
    [theme.breakpoints.down(phone)]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  assetTypeRowItem: {
    paddingBottom: '16px',
    paddingRight: '24px',
    [theme.breakpoints.down(phone)]: {
      paddingRight: '0',
    },
  },
}));

export default useStyles;
