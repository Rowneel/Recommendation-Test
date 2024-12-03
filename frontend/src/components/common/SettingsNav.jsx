import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive, isPending }) =>
      `px-5 py-2 block ${!isPending && isActive ? 'bg-gradient-to-r sm:bg-gradient-to-t from-primary from-0% to-background to-30%' : ''}`
    }
  >
    {children}
  </NavLink>
);

const SettingNav = () => {
  const [isSettingNavOpen, setIsSettingNavOpen] = useState(false);

  const hangleToggle = () => {
    setIsSettingNavOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsSettingNavOpen(false);
  };

  return (
    <div className="relative">
      {/* Desktop Nav */}
      <div className="lg:mx-36 md:mx-24 mx-4 text-xl sm:flex hidden">
        <NavItem to="/settings/profile">Profile</NavItem>
        <NavItem to="/settings/games">Your Games</NavItem>
        <NavItem to="/settings/misc">Misc</NavItem>
      </div>

      {/* Mobile Nav */}
      <div
        className={`absolute top-0 w-1/2 sm:hidden transform transition-transform duration-300 ${
          isSettingNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="text-xl flex flex-col bg-background border-2 border-primary"onClick={handleClose} >
          <NavItem to="/settings/profile">Profile</NavItem>
          <NavItem to="/settings/games">Your Games</NavItem>
          <NavItem to="/settings/misc">Misc</NavItem>
        </div>
        <span
          className="absolute top-0 -right-4 p-1 bg-primary"
          onClick={hangleToggle}
        >
          {isSettingNavOpen ? '<' : '>'}
        </span>
      </div>
    </div>
  );
};

export default SettingNav;
