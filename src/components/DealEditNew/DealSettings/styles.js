import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formFields: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
  },

  field: {
    width: '48.5%',
    marginBottom: '0.75rem',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },

  fieldLabel: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.2rem',
    fontWeight: '600',
    [theme.breakpoints.down('md')]: {
      fontWeight: '500',
      width: '100%',
    },
  },

  textInput: {
    margin: '5px 0',
    height: '3.5rem',
  },

  textInputDocspring: {
    margin: '5px 5px 5px 0px',
    height: '3.5rem',
    width: '75%',
  },

  copyButton: {
    width: 'max-content',
    padding: '7.5px',
  },
  dealDocuments: {
    width: '100%',
  },

  fieldLabelDealDocuments: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.2rem',
    fontWeight: '600',
  },

  documentList: {
    height: '10rem',
    listStyle: 'none',
    padding: '0',
    width: '100%',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '0',
    minHeight: '180px',
    [theme.breakpoints.down('md')]: {
      height: 'max-content',
      flexWrap: 'wrap',
      paddingTop: '1rem',
    },
  },

  documentItem: {
    height: '90%',
    width: '24%',
    minWidth: '250px',
    borderRadius: '20px',
    background: `${theme.colors.white[100]} 0% 0% no-repeat padding-box`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '1rem',
    position: 'relative',
    boxShadow: `0px 3px 6px ${theme.colors.black[100]}1d`,
    [theme.breakpoints.down('md')]: {
      height: '8rem',
      width: '100%',
      minWidth: 'max-content',
      marginRight: '0',
      marginBottom: '1rem',
    },
  },

  documentMenuButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    height: '1.5rem',
    backgroundColor: theme.colors.gray[200],
    width: '1.5rem',
    minWidth: '0',
    borderRadius: '100%',
    outline: `${theme.colors.primary[500]}2f`,
  },

  documentMenu: {
    border: '2px solid lime !important',
    '& .MuiMenu-paper': {
      display: 'flex',
      height: '2rem',
      margin: '0.5rem 0',
      border: '2px solid !important',
      color: 'red',
      [theme.breakpoints.down('md')]: {
        border: '2px solid lime !important',
      },
    },
  },

  documentLink: {
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  svgStyle: {
    transform: 'scale(2)',
  },

  documentTitle: {
    width: '100%',
    padding: '0',
    textAlign: 'center',
    margin: '0 1rem',
    fontSize: '1rem',
  },

  bannerUpload: {
    width: '100%',
  },

  upload: {
    width: '100%',
    margin: '0.5rem 0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  imagePreviewContainer: {
    width: '50%',
    position: 'relative',
  },

  imagePreview: {
    width: '100%',
  },

  deleteImage: {
    backgroundColor: theme.colors.primary[500],
    color: theme.colors.white[100],
    position: 'absolute',
    top: '10px',
    right: '10px',
  },
  uploadInBanner: {
    width: '100%',
    margin: '0.5rem 0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },

  uploadContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },

  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 'max-content',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },

  attachButton: {
    pointerEvents: 'initial',
    marginTop: '0.5rem',
    width: '12rem',
    height: '3rem',
    backgroundColor: theme.colors.primary[500],
    color: theme.colors.white[100],
    textTransform: 'none',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
  },

  pStyle: {
    margin: '0 1rem',
    fontWeight: 'normal',
    [theme.breakpoints.down('md')]: {
      width: '50%',
      fontWeight: '400',
    },
  },
  uploadButton: {
    marginTop: '0.5rem',
    width: '12rem',
    height: '3rem',
    backgroundColor: theme.colors.black[50],
    color: theme.colors.white[100],
    textTransform: 'none',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  disabled: {
    backgroundColor: `${theme.colors.black[50]}2a`,
    color: `${theme.colors.gray[500]}80`,
  },

  imageCropContainer: {
    position: 'relative',
  },

  imageCropper: {
    top: '0',
    zIndex: '10',
    width: '100%',
  },

  imagePreviewCropContainer: {
    minWidth: '100%',
    height: '3rem',
    zIndex: '15',
    position: 'absolute',
    bottom: '0%',
  },

  cropButton: {
    zIndex: '20',
    background: theme.colors.white[100],
    width: '8rem',
    height: '2.5rem',
    overflow: 'auto',
    margin: '0 auto',
    position: 'absolute',
    left: '0',
    bottom: '5%',
    right: '0',
  },
  saveButton: {
    textTransform: 'none',
    backgroundColor: theme.colors.primary[500],
    color: 'white',
    width: '6rem',
    margin: '5px 0px',
    height: '3.5rem',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
}));

export default useStyles;
