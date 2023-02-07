import { NavLink } from 'react-router-dom';
import links from '../utils/links';
import { useLocation } from 'react-router-dom';
import { ImArrowRight } from 'react-icons/im';

// const linksArbetsformedlingen = [
//   {
//     id: 5,
//     text: 'To Jobify',
//     path: '/',
//     icon: <TiArrowRightThick />,
//   },
// ];

const NavLinks = ({ toggleSidebar }) => {
  // make a custom usePathName hook
  const { pathname } = useLocation();
  const isPathNameArbetsformedlingen = pathname === '/arbetsformedlingen';

  // const renderLinks = isPathNameArbetsformedlingen
  //   ? linksArbetsformedlingen
  //   : links;

  return (
    <div className="nav-links">
      <h4 className="nav-links-title">Jobify</h4>
      {links.map((link) => {
        const { id, path, icon, text } = link;
        return (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link '
            }
            onClick={toggleSidebar}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
      <NavLink
        className={({ isActive }) =>
          isActive ? 'nav-link nav-link-af active' : 'nav-link nav-link-af'
        }
        to={isPathNameArbetsformedlingen ? '/' : '/arbetsformedlingen'}
      >
        <span className="icon ">{<ImArrowRight color="#B7EE4A" />}</span>
        {isPathNameArbetsformedlingen ? 'To Jobify' : 'To AF'}
      </NavLink>
    </div>
  );
};
export default NavLinks;
