import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { motion } from 'framer-motion';



// Framer Motion variants for the side menu
const sidebarVariants = {
  open: {
    clipPath: `circle(1500px at 90% 10%)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  },
  closed: {
    clipPath: "circle(30px at 110% -10%)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const linkVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
    },
  },
  closed: {
    opacity: 0,
    y: 50,
    transition: {
      delay: 0.1,
    },
  },
};

// Icon path variants for morphing animation
const iconVariants = {
  open: { d: "M 3 16.5 L 17 2.5", transition: { duration: 0.3 } },
  closed: { d: "M 2 2.5 L 20 2.5", transition: { duration: 0.3 } },
};

const iconTopVariants = {
  open: { d: "M 3 2.5 L 17 16.5", transition: { duration: 0.3 } },
  closed: { d: "M 2 7.5 L 20 7.5", transition: { duration: 0.3 } },
};

const iconBottomVariants = {
  open: { opacity: 0, transition: { duration: 0.3 } },
  closed: { opacity: 1, d: "M 2 12.5 L 20 12.5", transition: { duration: 0.3 } },
};

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'The Agency', path: '/the-agency' },
    { name: 'Contact', path: '/contact' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="relative flex items-center justify-between w-full px-5 py-10 bg-white md:px-0 md:justify-end">
      <div className="px-3 bg-white md:absolute left-5 top-[54px]">
        <img src={Logo} className="w-72" alt="Kagency logo" />
      </div>
      
      {/* Menu Button */}
      <button
        className="z-50 flex flex-col items-center justify-center w-8 h-8 md:hidden focus:outline-none"
        onClick={toggleMobileMenu}
      >
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 23 23"
          className="text-black-500"
        >
          <motion.path
            variants={iconTopVariants}
            animate={isMobileMenuOpen ? "open" : "closed"}
            fill="transparent"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
          />
          <motion.path
            variants={iconVariants}
            animate={isMobileMenuOpen ? "open" : "closed"}
            fill="transparent"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
          />
          <motion.path
            variants={iconBottomVariants}
            animate={isMobileMenuOpen ? "open" : "closed"}
            fill="transparent"
            strokeWidth="3"
            stroke="currentColor"
            strokeLinecap="round"
          />
        </motion.svg>
      </button>

      <nav className="hidden w-1/2 md:block">
      <ul className="flex items-baseline justify-between font-sans text-xl font-bold uppercase">
        {navLinks.map((link, index) => {
          const isActive = location.pathname === link.path;
          return (
            <li key={index}>
              <Link
                className={`px-5 pt-2 pb-[5px] rounded-full trim-both ${isActive ? 'bg-red-500 text-white' : 'hover:bg-red-500 hover:text-white'}`}
                to={link.path}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>

      {/* Mobile Menu */}
      <motion.nav
        initial={false}
        animate={isMobileMenuOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-red-500 md:hidden"
      >
        <ul className="flex flex-col items-center space-y-8 font-sans text-3xl font-bold uppercase">
          {navLinks.map((link, index) => (
            <motion.li key={index} variants={linkVariants}>
              <Link
                className="px-5 pt-3 pb-[5px] rounded-full hover:bg-white hover:text-red-500"
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.nav>
    </div>
  );
}

export default Header;
