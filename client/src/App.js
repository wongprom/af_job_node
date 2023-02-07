import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Error, Landing, Register, ProtectedRoute } from './pages';
import {
  AddJob,
  AllJobs,
  Profile,
  Stats,
  SharedLayout,
} from './pages/dashboard/index';
import { SharedLayoutArbetsformedlingen } from './pages/dashboard/arbetsformedlingen/index';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/arbetsformedlingen"
          element={
            <ProtectedRoute>
              <SharedLayoutArbetsformedlingen />
            </ProtectedRoute>
          }
        >
          <Route index element={<div>Arbetsförmedlingen</div>} />
          {/* <Route path="all-jobs" element={<AllJobs />}></Route>
          <Route path="add-job" element={<AddJob />}></Route>
          <Route path="profile" element={<Profile />}></Route> */}
        </Route>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />}></Route>
          <Route path="add-job" element={<AddJob />}></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route
          path="*"
          element={
            <div>
              <Error />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
