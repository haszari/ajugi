import { orange } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff0022",
    },
    secondary: {
      main: "#22ff00",
    },
    error: {
      main: orange.A400,
    },
    background: {
      default: "#aaa",
    },
  },
});

export default theme;
