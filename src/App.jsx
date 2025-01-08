import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Ma\'lumot yuklashda xato');
        setLoading(false);
      });
  }, []);
  
  const handleDelete = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(() => setError('Foydalanuvchini o\'chirishda xato'));
  };
  
  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Foydalanuvchilar</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleDelete(user.id)}>O'chirish</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddUser() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { username, email, password };
    axios.post('https://reqres.in/api/users', newUser)
      .then(() => setMessage('Foydalanuvchi muvaffaqiyatli qo\'shildi'))
      .catch(() => setMessage('Foydalanuvchi qo\'shishda xato'));
  };

  return (
    <div>
      <h1>Yangi foydalanuvchi qoshish</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Qoshish</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Xush kelibsiz!</h1>
      <Link to="/blogs">Bloglar ro'yxatiga o'tish</Link>
    </div>
  );
}

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Ma\'lumot yuklashda xato');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Bloglar royxati</h1>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <h3>{blog.title}</h3>
            <p>{blog.body.substring(0, 100)}...</p>
            <Link to={`/blogs/${blog.id}`}>Tafsilotlar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(response => {
        setBlog(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Xatolik yuz berdi!');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>{blog.body}</p>
      <button onClick={() => navigate(-1)}>Orqaga qaytish</button>
    </div>
  );
}

function Layout() {
  const location = useLocation();
  console.log(`Hozirgi sahifa: ${location.pathname}`);

  return (
    <div>
      <header>
        <nav>
          <Link to="/">Bosh sahifa</Link>
          <Link to="/blogs">Bloglar</Link>
          <Link to="/add-user">Yangi foydalanuvchi qoshish</Link>
          <Link to="/users">Foydalanuvchilar</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/users" element={<UsersList />} />
        </Routes>
      </main>
      <footer>
        <p>©TOHIRJONOV HADYATILLO & 6-dars</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
