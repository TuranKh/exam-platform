import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";

const ConfirmationDialog = lazy(
  () => import("./components/ConfirmationDialog"),
);
const Layout = lazy(() => import("./components/Layout"));
const ProtectedRouter = lazy(() => import("./components/ProtectedRouter"));
const AuthPage = lazy(() => import("./pages/auth"));
const Exam = lazy(() => import("./pages/exams/exam"));
const NotFound = lazy(() => import("./pages/not-found"));
const Pending = lazy(() => import("./pages/pending"));
const Profile = lazy(() => import("./pages/profile"));
const UserExam = lazy(() => import("./pages/user-exams/exam"));
import { sidebarRoutes, UserRole } from "./config/sidebar";
import Loading from "./components/Loading";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRouter>
        <Layout>
          <Profile />
        </Layout>
      </ProtectedRouter>
    ),
  },
  ...sidebarRoutes.map((sidebarDetails) => {
    return {
      path: sidebarDetails.url,
      element: (
        <ProtectedRouter userRole={sidebarDetails.allowedRole}>
          <Layout>{sidebarDetails.component}</Layout>
        </ProtectedRouter>
      ),
    };
  }),
  {
    path: "/not-found",
    element: <NotFound />,
  },
  {
    path: "/pending",
    element: <Pending />,
  },
  {
    path: "/exams/:id",
    element: (
      <ProtectedRouter userRole={UserRole.Admin}>
        <Layout>
          <Exam />
        </Layout>
      </ProtectedRouter>
    ),
  },
  {
    path: "/available-exams/:id",
    element: (
      <ProtectedRouter userRole={UserRole.Student}>
        <Layout>
          <UserExam />
        </Layout>
      </ProtectedRouter>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
      <Toaster
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 3000,
          },
        }}
        position='bottom-right'
        reverseOrder={false}
      />
      <ConfirmationDialog />
    </Suspense>
  );
}

export default App;
