import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Modals from "./components/Modals";
import ProtectedRouter from "./components/ProtectedRouter";
import { sidebarRoutes, UserRole } from "./config/sidebar";
import Dashboard from "./pages";
import AuthPage from "./pages/auth";
import Exam from "./pages/exams/exam";
import NotFound from "./pages/not-found";
import Pending from "./pages/pending";
import UserExam from "./pages/user-exams/exam";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRouter>
        <Dashboard />
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
    element: <AuthPage />,
  },
]);

function App() {
  return (
    <>
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
      <Modals />
    </>
  );
}

export default App;
