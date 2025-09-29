import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './ui/App.css'
import Layout from './ui/Layout/Layout';
import Home from '../pages/home/Home';
import Privacy from '../pages/privacy/Privacy';
import About from '../pages/about/About';
import AppContext from './features/context/AppContext';
import { useEffect, useState } from 'react';
import Base64 from "../shared/base64/Base64";
import Intro from '../pages/intro/intro';
import AuthModal from './ui/Layout/AuthModal';
import Group from '../pages/group/Group';


function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [productGroup, setProductGroup] = useState([]);

  useEffect(() => {
    request("/api/product-group")
       .then(homePageData => setProductGroup(homePageData.productGroup))
  },[]);

  useEffect(() => {
    setUser( token == null ? null : Base64.jwtDecodePayload(token) );
  }, [token]);

  const request = (url, conf) => new Promise((resolve, reject) => {
    if(url.startsWith('/')) {
      url = "https://localhost:7111" + url;
    }
    fetch(url, conf)
       .then(r => r.json())
       .then(j => {
        if(j.status.isOk) {
            resolve(j.data);
        }
        else {
          console.error(j);
            reject(j);
        }
       });
  });

  return <AppContext.Provider value={ {request, user, token, setToken, productGroup}}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route index element={<Home />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="group/:slug" element={<Group />} />
        <Route path="intro" element={<Intro />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
    </BrowserRouter>
</AppContext.Provider>;
}

export default App;
