import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css'
import Layout from './ui/Layout';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import About from '../pages/about/About';
import AppContext from './features/context/AppContext';
import { useState } from 'react';


function App() {
  const [user, setUser] = useState(null);

  return <AppContext.Provider value={ {message: "Hello from App", user, setUser}}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
    </BrowserRouter>
</AppContext.Provider>;
}

export default App;
