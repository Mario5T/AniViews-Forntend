import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './components/Toast.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles.css'
import App from './App.jsx'
import '@fontsource-variable/roboto'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#39FF14' }, 
    background: { default: '#000000', paper: '#0a0a0a' },
    divider: 'rgba(57,255,20,0.15)'
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0px 2px 8px rgba(57,255,20,0.08)',
    '0px 4px 12px rgba(57,255,20,0.10)',
    ...Array(22).fill('0 8px 24px rgba(0,0,0,0.4)')
  ],
  components: {
    MuiCard: { styleOverrides: { root: { transition: 'transform .2s ease, box-shadow .2s ease' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700 } } },
    MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none', backdropFilter: 'blur(6px)' } } },
  }
})

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
