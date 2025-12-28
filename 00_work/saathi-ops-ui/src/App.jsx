import { useState, useEffect, useContext } from 'react';
import './App.css';
import { parseCookies } from 'nookies';
import { Routes, Route } from 'react-router-dom';
import ResetPassword from './pages/resetPassword';
import AuthScreen from './pages/authScreen';
import Home from './pages/home';
import Customers from './pages/customers';
import Courses from './pages/courses';
import Employers from './pages/employers';
import Layout from './components/Layout';
import CourseDetails from './pages/courseDetail';
import CustomerDetails from './pages/customerDetails';
import Payments from './pages/payments';
import Refund from './pages/refunds';
import Orders from './pages/orders';
import Tests from './pages/tests';
import ProtectedRoute from './components/ProtectedRoute';
import OrdersDetails from './pages/ordersDetails';
import PaymentsDetails from './pages/paymentDetails';
import { useGetUserDetails } from './apis/queryHooks';
import { UserContext } from './context/UserContext';
import useQueryToken from './hooks/useQueryToken';
import PaymentProvider from './context/PaymentContext';
import usePermission from './hooks/usePermission';
import Unauthorized from './pages/unauthorized';
import UnauthorizedRoute from './components/common/UnauthorizedRoute';
import { PAGE_PERMISSIONS } from './constants/permissions';
import UserManagement from './pages/userManagement';
import TestDetails from './pages/testDetails';
import PayoutRequests from './pages/payoutRequests';
import AllJobs from './pages/allJobs';
import PostNewJob from './pages/postNewJob';
import JobVideoUpload from './pages/jobVideoUpload';
import EmployerDetailsRouter from './pages/empDetails';
import AddEmployer from './pages/addEmp';
import Applications from './pages/applications';
import EmployerJobDetailPage from './pages/employerJobDetailPage';
import ApplicantDetails from './pages/applicationDetails';
import MerchantSupport from './pages/merchantSupport';
import Campaigns from './pages/campaigns';
import DeviceDetails from './pages/deviceDetails';
import Applicants from './pages/applicants';
import Interviews from './pages/interviews';

function App() {
  const cookies = parseCookies();
  const { hasPermission } = usePermission();
  const [token, setToken] = useState(cookies?.accessToken);
  const [userId, setUserId] = useState(cookies?.userId);
  const { setUser } = useContext(UserContext);
  const { data: userData, status: userStatus } = useGetUserDetails(
    userId,
    token,
  );

  useQueryToken({ setToken, setUserId });

  useEffect(() => {
    if (userStatus === 'success') {
      setUser(userData);
    }
  }, [userStatus]);

  return (
    <Routes>
      <Route
        path="/login"
        element={<AuthScreen token={token} setToken={setToken} />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={token !== undefined}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route
          path="reset-password"
          element={<ResetPassword token={token} setToken={setToken} />}
        />
        <Route
          path="customers"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS.VIEW_CUSTOMER)}
            >
              <Customers />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="applicants"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS.VIEW_JOB_DATA)}
            >
              <Applicants />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="interviews"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS.VIEW_JOB_DATA)}
            >
              <Interviews />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="courses"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS.VIEW_COURSE)}
            >
              <Courses />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="courses/:id"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS.VIEW_COURSE_DETAILS)}
            >
              <CourseDetails />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS.VIEW_ORDERS)}
            >
              <Orders />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="orders/:id"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS.VIEW_ORDER_DETAILS)}
            >
              <OrdersDetails />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="payments"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS.VIEW_PAYMENTS)}
            >
              <PaymentProvider>
                <Payments />
              </PaymentProvider>
            </UnauthorizedRoute>
          }
        />
        <Route
          path="refund"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS.VIEW_PAYMENTS)}
            >
              <PaymentProvider>
                <Refund />
              </PaymentProvider>
            </UnauthorizedRoute>
          }
        />
        <Route
          path="payments/:id"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(
                PAGE_PERMISSIONS.VIEW_PAYMENT_DETAILS,
              )}
            >
              <PaymentsDetails />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="refund/:id"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(
                PAGE_PERMISSIONS.VIEW_PAYMENT_DETAILS,
              )}
            >
              <PaymentsDetails />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="customers/:id"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(
                PAGE_PERMISSIONS.VIEW_CUSTOMER_DETAILS,
              )}
            >
              <CustomerDetails />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(
                PAGE_PERMISSIONS.VIEW_ROLES_MANAGEMENT,
              )}
            >
              <UserManagement />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="tests"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_TESTS)}
            >
              <Tests />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="tests/:id"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_TESTS)}
            >
              <TestDetails />
            </UnauthorizedRoute>
          }
        />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route
          path="employers"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_EMPLOYERS)}
            >
              <Employers />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="employers/add-employer"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(
                PAGE_PERMISSIONS?.VIEW_EMPLOYER_DETAILS,
              )}
            >
              <AddEmployer />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="employers/:id"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(
                PAGE_PERMISSIONS?.VIEW_EMPLOYER_DETAILS,
              )}
            >
              <EmployerDetailsRouter />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="employers/:employerId/add-job"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_EMPLOYERS)}
            >
              <PostNewJob />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="employers/:employerId/job/:jobId/edit-job"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_EMPLOYERS)}
            >
              <PostNewJob />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="job/:jobId"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_EMPLOYERS)}
            >
              <EmployerJobDetailPage />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="jobs/:jobId/applications"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_EMPLOYERS)}
            >
              <Applications />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="job-video-upload/:jobId"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_EMPLOYERS)}
            >
              <JobVideoUpload />
            </UnauthorizedRoute>
          }
        />

        <Route
          path="applications/:applicantId"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(
                PAGE_PERMISSIONS?.VIEW_EMPLOYER_DETAILS,
              )}
            >
              <ApplicantDetails />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="payouts"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(
                PAGE_PERMISSIONS.VIEW_PAYOUT_REQUESTS,
              )}
            >
              <PayoutRequests />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="all-jobs"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_EMPLOYERS)}
            >
              <AllJobs />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="merchant-support"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_FIELD_AGENT)}
            >
              <MerchantSupport />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="campaigns"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(PAGE_PERMISSIONS?.VIEW_MARKETING_CAMPAIGNS)}
            >
              <Campaigns />
            </UnauthorizedRoute>
          }
        />
        <Route
          path="devices/:deviceId"
          element={
            <UnauthorizedRoute
              isAuthorized={hasPermission(
                PAGE_PERMISSIONS.VIEW_CUSTOMER_DETAILS,
              )}
            >
              <DeviceDetails />
            </UnauthorizedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
