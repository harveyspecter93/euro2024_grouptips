'use client';


import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const getLinkClass = (path) => {
    return router.pathname === path
      ? 'text-blue-600 bg-white rounded-md px-3 py-2 font-medium'
      : 'text-white hover:bg-blue-500 hover:text-white rounded-md px-3 py-2 font-medium';
  };

  return (
    <div className="bg-blue-700 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-10 mr-4" />
          <h1 className="text-2xl font-bold">UEFA EURO 2024 - Heute Bierli😎🍻</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" legacyBehavior>
            <a className={getLinkClass('/')}>Partien</a>
          </Link>
          <Link href="/zusatzfragen" legacyBehavior>
            <a className={getLinkClass('/zusatzfragen')}>Zusatzfragen</a>
          </Link>
          <Link href="/ranking" legacyBehavior>
            <a className={getLinkClass('/ranking')}>Ranking</a>
          </Link>
        </nav>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            <Link href="/" legacyBehavior>
              <a onClick={toggleMenu} className={getLinkClass('/')}>Partien</a>
            </Link>
            <Link href="/zusatzfragen" legacyBehavior>
              <a onClick={toggleMenu} className={getLinkClass('/zusatzfragen')}>Zusatzfragen</a>
            </Link>
            <Link href="/ranking" legacyBehavior>
              <a onClick={toggleMenu} className={getLinkClass('/ranking')}>Ranking</a>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;