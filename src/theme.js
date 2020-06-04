import {red} from '@material-ui/core/colors';
import {createMuiTheme} from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  overrides: {
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
      default: '#eff3f5',
    },
  },
});

export default theme;
