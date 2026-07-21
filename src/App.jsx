import './App.css'
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import ProfilePasswordPage from './pages/ProfilePasswordPage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/password" element={<ProfilePasswordPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/post-detail" element={<PostDetailPage />} />
    </Routes>
  );
}

export default App;