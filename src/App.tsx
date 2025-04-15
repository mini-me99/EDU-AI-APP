import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tasks from './components/Tasks';
import Stopwatch from './components/Stopwatch';
import AIChat from './components/AIChat';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <Router basename="/EDU_AI">
          <Layout>
            <Routes>
              <Route path="/" element={<Tasks />} />
              <Route path="/stopwatch" element={<Stopwatch />} />
              <Route path="/chat" element={<AIChat />} />
            </Routes>
          </Layout>
        </Router>
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
