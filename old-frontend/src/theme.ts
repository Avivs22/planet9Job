// @ts-nocheck
import { createTheme } from '@mui/material';

const globalTheme = createTheme({
  spacing: 8,

  palette: {
    mode: 'dark',
    primary: {
      main: '#75b3ff',
    }
  },

  typography: {
    fontSize: 14,
    fontFamily: [
      'Helvetica',
    ].join(','),
    allVariants: {
      color: 'white',
    }
  },

  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff30",
          borderRadius: 6,
          overflow: 'auto'

        },
      },
    },
    
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: 'white',
        }
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(#ffffff4c, #ffffff19)',
        }
      }
    },

    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          fontFamily: 'Helvetica Medium',
          fontWeight: 500,
          sx: { ml: 1 },
        },
      },
    },

    MuiCardContent: {
      defaultProps: {
        sx: {
          ml: 1,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {

        }
      }
    },

    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
          border: 'solid 1px #777',
          color: 'white',
        }
      }
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          paddingTop: '6px',
          paddingBottom: '6px',
          borderBottom: '0px',
        },

        root: {
          paddingLeft: '32px',
          paddingRight: '32px',
          borderBottom: '1px solid #75b3ff30',
        }
      }
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          '&.Mui-selected': {
            background: '#75b3ff',
            color: 'white',
          },
        },
      }
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          textAlign: 'left',
          alignItems: 'left',
          borderBottom: 'solid 2px #69b3ff4c',
          padding: '0',
          minHeight: '24px',
        },
      }
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: '24px',

          '& .MuiTabs-indicator': {
            background: '#75b3ff',
          },

          '& .MuiTouchRipple-root': {
            width: '100%',
            height: '100%',
          }
        }
      }
    },

    MuiSelect: {
      defaultProps: {
        disableUnderline: true,
        inputProps: {
          sx: { fontSize: 14, mb: '-2px' }
        }
      },
      styleOverrides: {
        root: {
          background: '#ecf0f5',
          borderRadius: '16px',
          paddingLeft: '16px',
        },
      },
    },
  }
});



export default globalTheme;
