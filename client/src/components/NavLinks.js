import { NavLink } from 'react-router-dom';
import links from '../utils/links';
import { useLocation } from 'react-router-dom';
import { ImArrowRight } from 'react-icons/im';
import { SiWorkplace } from 'react-icons/si';

const linksArbetsformedlingen = [
  {
    id: 5,
    text: 'AF',
    path: '/arbetsformedlingen',
    icon: <SiWorkplace />,
    end: true,
  },
  {
    id: 6,
    text: 'All Jobs AF',
    path: '/arbetsformedlingen/all-jobs-af',
    icon: <SiWorkplace />,
    end: false,
  },
];

const NavLinks = ({ toggleSidebar }) => {
  // make a custom usePathName hook
  const location = useLocation();
  const isPathNameIncludesArbetsformedlingen =
    location.pathname.includes('arbetsformedlingen');

  const renderLinks = isPathNameIncludesArbetsformedlingen
    ? linksArbetsformedlingen
    : links;

  return (
    <div className="nav-links">
      <h4 className="nav-links-title">
        {isPathNameIncludesArbetsformedlingen ? 'AF' : 'Jobify'}
      </h4>
      {renderLinks.map((link) => {
        const { id, path, icon, text, end = false } = link;
        return (
          <NavLink
            key={id}
            to={path}
            end={end}
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
        to={isPathNameIncludesArbetsformedlingen ? '/' : '/arbetsformedlingen'}
      >
        <span className="icon">{<ImArrowRight color="#B7EE4A" />}</span>
        {isPathNameIncludesArbetsformedlingen ? 'To Jobify' : 'To AF'}
      </NavLink>
    </div>
  );
};
export default NavLinks;
