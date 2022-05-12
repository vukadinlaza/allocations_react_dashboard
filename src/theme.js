import { createTheme } from '@material-ui/core/styles';
import { colors } from '@allocations/design-system';

// A custom theme for this app
const theme = createTheme({
  overrides: {
    MuiInputLabel: {
      /* fix bug in <Select /> with helper text, only works on white backgrounds
       * https://github.com/mui-org/material-ui/issues/16954#issuecomment-580034129 */
      outlined: {
        backgroundColor: colors.white[100],
        paddingLeft: 2,
        paddingRight: 2,
      },
    },
    MuiTypography: {
      subtitle2: {
        color: colors.gray[300],
      },
    },
    MuiButton: {
      containedPrimary: {
        boxShadow: 'none',
        textTransform: 'capitalize',
        fontWeight: 'bolder',
      },
      containedSecondary: {
        boxShadow: 'none',
        color: colors.white[100],
        textTransform: 'capitalize',
      },
    },
    MuiTableHead: {
      root: {
        background: colors.white[100],
      },
    },
    MuiTableCell: {
      root: {
        color: `${colors.gray[400]} !important`,
      },
    },
    MuiPaper: {
      root: {
        border: `1px solid ${colors.gray[300]}`,
        boxShadow:
          '0px 2px 1px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.04), 0px 1px 3px 0px rgba(0,0,0,0.02) !important',
      },
      rounded: {
        border: '0px',
        overflow: 'hidden',
        boxShadow: '0px 3px 6px #00000029 !important',
      },
    },
  },
  palette: {
    primary: {
      main: colors.primary[500],
    },
    secondary: {
      main: colors.success[500],
    },
    error: {
      main: colors.error[500],
    },
    background: {
      default: colors.white[100],
    },
  },
});

export default theme;
