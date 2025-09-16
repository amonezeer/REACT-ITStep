import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css'
import Layout from './ui/Layout';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="privacy" element={<Privacy />} />
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
