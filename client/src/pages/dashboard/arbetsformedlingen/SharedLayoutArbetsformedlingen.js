import { Outlet } from 'react-router-dom';
import Wrapper from '../SharedLayout';
import { Navbar, BigSidebar, SmallSidebar } from '../../../components/index';

const SharedLayoutArbetsformedlingen = () => {
  return (
    <Wrapper>
      <main className="dashboard">
        <SmallSidebar />
        <BigSidebar />
        <div>
          <Navbar />
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default SharedLayoutArbetsformedlingen;
