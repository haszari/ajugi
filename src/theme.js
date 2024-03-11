import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app…
// …or not, need to better understand how to define a custom theme from 1-3 colours.
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    // primary: {
    //   main: "#ff4400",
    // },
  //   secondary: {
  //     main: "#22ff00",
  //   },
  //   error: {
  //     main: orange.A400,
  //   },
    background: {
      default: "orange",
    },
  //   action: {
  //     selected: "green",
  //   },
  },
});

export default theme;
