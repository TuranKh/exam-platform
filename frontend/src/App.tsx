import toast, { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
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
import { supabase } from "./supabase/init";
import { useQuery } from "react-query";
import UserService, { UserDetails } from "./service/UserService";
import { useUserStore } from "./store/UserStore";

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
  const { userDetails, setUserDetails } = useUserStore();

  useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const details = (await UserService.getUser()) as UserDetails;
      setUserDetails(details);
      return details;
    },
  });

  useEffect(() => {
    (async () => {
      const user = await supabase.auth.getUser();
      console.log(user);
    })();
    if (!userDetails?.isPending && userDetails?.isAdmin) {
      subscribeToChanges();
    }

    const storeUserLastActivity = async function () {
      if (userDetails.isAdmin) {
        await UserService.updateLastActivity(userDetails.id);
      }
    };
    window.addEventListener("beforeunload", storeUserLastActivity);

    return () => {
      window.removeEventListener("beforeunload", storeUserLastActivity);
    };
  }, [userDetails]);

  const subscribeToChanges = function () {
    const channel = supabase.channel("users");

    const onUpdate = (payload) => {
      console.log("Change received!", payload);
    };

    const onInsert = (payload: { new: UserDetails }) => {
      toast.custom(
        (t) => {
          return (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className='flex-1 w-0 p-4'>
                <div className='flex items-start'>
                  <div className='flex-shrink-0 pt-0.5'>
                    <img
                      className='h-10 w-10 rounded-full'
                      src={payload.new.profileImageUrl}
                      alt='profile-image'
                    />
                  </div>
                  <div className='ml-3 flex-1'>
                    <p className='text-sm font-medium text-gray-900'>
                      {payload.new.name}
                      {payload.new.surname || ""}
                    </p>
                    <p className='mt-1 text-sm text-gray-500'>
                      Yeni istifadəçi əlavə edildi
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex border-l border-gray-200'>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                >
                  Bağla
                </button>
              </div>
            </div>
          );
        },
        {
          position: "top-center",
          duration: 20_000,
        },
      );
    };

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "users" },
        onInsert,
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "users" },
        onUpdate,
      )
      .subscribe();
  };

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
