import './App.css'
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ProfilePasswordPage from './pages/ProfilePasswordPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/password" element={<ProfilePasswordPage />} />
    </Routes>
  );
}

export default App;