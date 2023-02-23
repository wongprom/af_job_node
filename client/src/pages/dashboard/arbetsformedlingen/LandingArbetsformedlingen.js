import { Link } from 'react-router-dom';
import style from 'styled-components';

const LandingArbetsformedlingen = () => {
  const StyledLandingArbetsformedlingen = style.div`
pad
  `;
  return (
    <StyledLandingArbetsformedlingen>
      <h1>Welcome to AF</h1>

      <Link to="/arbetsformedlingen/all-jobs-af" className="btn-af">
        To Platsbanken
      </Link>
    </StyledLandingArbetsformedlingen>
  );
};
export default LandingArbetsformedlingen;
