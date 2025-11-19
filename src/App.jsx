import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { Box } from '@mui/material';
import LeftNav from './components/LeftNav.jsx';
import RightWidgets from './components/RightWidgets.jsx';
import Home from './pages/Home.jsx';
import AnimeDetails from './pages/AnimeDetails.jsx';
import Search from './pages/Search.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import MyLists from './pages/MyLists.jsx';
import Recommendations from './pages/Recommendations.jsx';
import TopRated from './pages/TopRated.jsx';
import Genres from './pages/Genres.jsx';
import ThreadPage from './pages/ThreadPage.jsx';
import Simulcasts from './pages/Simulcasts.jsx';

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px 1fr 300px' }, gap: 3 }}>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <LeftNav />
          </Box>
          <Box>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/users/:id" element={<Profile />} />
              <Route path="/me/lists" element={<MyLists />} />
              <Route path="/me/recommendations" element={<Recommendations />} />
              <Route path="/top" element={<TopRated />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/simulcasts" element={<Simulcasts />} />
              <Route path="/threads/:id" element={<ThreadPage />} />
            </Routes>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <RightWidgets />
          </Box>
        </Box>
      </div>
      <Footer />
    </div>
  );
}
