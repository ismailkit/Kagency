import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Landing from './components/landingpage/Landing'
import About from './components/about/About';
import Agency from './components/agency/Agency';
import Services from './components/services/Services';
import Contact from './components/contact/Contact'

const App = () => {
  return (
    <div className="container mx-auto">
      <Router>
        <header>
          <Header />
        </header>
        <main className='border-black-500 border-t-[3px] rounded-t-xl'>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/the-agency" element={<Agency />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
