import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import CreatePlan from './pages/CreatePost.jsx';
import UserPosts from './pages/MyPage.jsx';
import Post from './pages/TestingPage.jsx';
import TodayPlan from './pages/TodayPlan.jsx';
import AllPlans from './pages/AllPlans.jsx';
import Profile from './pages/Profile.jsx';
import SearchProfiles from './pages/SearchProfiles.jsx';
import UserProfile from './pages/UserProfile.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/createpost' element={<CreatePlan mode="create"/>} />
        <Route path='/myposts' element={<UserPosts />} />
        <Route path='/post' element={<Post />} />
        <Route path='/todayplan' element={<TodayPlan />} />
        <Route path='/allplans' element={<AllPlans />} />
        <Route path="/editplan/:id" element={<CreatePlan mode="edit" />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/search' element={<SearchProfiles />} />
        <Route path='/user/:id' element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
