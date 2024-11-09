import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { TableUser } from './components/table-tabs';
import { ThemeProvider } from './components/ui/theme-provider';
import NotFoundPage from './pages/not-found';
import SignInPage from './pages/sign-in';
import LoginPage from './pages/sign-up';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="flex justify-center min-h-screen">
          {/* Define the Routes */}
          <Routes>
            <Route path="/signup" element={<LoginPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/" element={<TableUser />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
