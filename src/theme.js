import {red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  overrides: {
    MuiInputLabel: {
      /*fix bug in <Select /> with helper text, only works on white backgrounds
      * https://github.com/mui-org/material-ui/issues/16954#issuecomment-580034129 */
      outlined: {
        backgroundColor: "#fff",
        paddingLeft: 2,
        paddingRight: 2
      }
    },
    MuiTypography: {
      subtitle2: {
        color: "#9ea0a5"
      }
    },
    MuiTableHead: {
      root: {
        background: "#f3f7f8",
      }
    },
    MuiTableCell: {
      root: {
        color: "#7f8fa4 !important"
      }
    },
    MuiPaper: {
      root: {
        border: "1px solid #d8dce6",
        boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.04), 0px 1px 3px 0px rgba(0,0,0,0.02) !important"
      },
    },
  },
  palette: {
    primary: {
      main: '#00a0c6',
    },
    secondary: {
      main: '#fdb858',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
