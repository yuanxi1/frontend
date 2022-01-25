import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'BlinkMacSystemFont',
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#1E88E5',
    },
    secondary: {
      main: '#B39DDB',
      light: '#EDE7F6',
    },
    success: {
        main: '#00C853',
    },
    info:{
        main:'#9E9E9E',
    }
  },
});