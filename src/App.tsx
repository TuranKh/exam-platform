import { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Modals from "./components/Modals";
import ProtectedRouter from "./components/ProtectedRouter";
import { sidebarRoutes } from "./config/sidebar";
import Dashboard from "./pages";
import AuthPage from "./pages/auth";
import CreateExam from "./pages/create-exam";
import NotFound from "./pages/not-found";
import UserService from "./service/UserService";

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
        <ProtectedRouter>
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
    path: "/exams/:id",
    element: (
      <ProtectedRouter>
        <Layout>
          <CreateExam />
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
      <Toaster position='bottom-right' reverseOrder={false} />
      <Modals />
    </>
  );
}

export default App;
