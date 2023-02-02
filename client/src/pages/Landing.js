import { Link, Navigate } from 'react-router-dom';
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Logo } from '../components';
import { useAppContext } from '../context/appContext';

const Landing = () => {
  const { user } = useAppContext();

  return (
    <React.Fragment>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          <div className="info">
            <h1>
              job<span> tracking </span>app
            </h1>
            <p>
              I'm baby live-edge woke you probably haven't heard of them,
              tousled kinfolk schlitz enamel pin. Letterpress gluten-free sus
              ugh. Adaptogen sus beard pug readymade vaporware subway tile
              whatever taxidermy plaid cray literally artisan next level.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login/register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </React.Fragment>
  );
};

export default Landing;
