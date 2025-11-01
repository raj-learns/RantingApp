import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import CreatePost from './pages/CreatePost.jsx';
import UserPosts from './pages/MyPage.jsx';
import Post from './pages/TestingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/createpost' element={<CreatePost />} />
        <Route path='/myposts' element={<UserPosts />} />
        <Route path='/post' element={<Post />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
