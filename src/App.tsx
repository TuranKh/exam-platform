import { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages";
import AuthPage from "./pages/auth";
import UserService from "./service/UserService";
import ProtectedRouter from "./components/ProtectedRouter";

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
  {
    path: "*",
    element: <AuthPage />,
  },
]);

function App() {
  const userDetails = useQuery({
    queryKey: ["get-user"],
    queryFn: UserService.getUser,
  });

  console.log({ userDetails: userDetails.data?.data.user });
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='top-center' reverseOrder={false} />
    </>
  );
}

export default App;
