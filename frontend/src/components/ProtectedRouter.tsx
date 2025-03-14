import UserService from "@/service/UserService";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { UserRole } from "@/config/sidebar";

export default function ProtectedRouter({
  children,
  userRole,
}: {
  children: JSX.Element;
  userRole?: UserRole;
}) {
  const { data: userDetails, isLoading } = useQuery({
    queryKey: ["get-user"],
    queryFn: UserService.getUser,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (isLoading) {
    return <Loading />;
  }

  const isAuthorized = userDetails?.email;
  const isPending = userDetails?.isPending;
  if (isPending) {
    return <Navigate to='/pending' />;
  }

  if (isAuthorized) {
    if (!userRole) {
      return children;
    }

    if (userRole === UserRole.Admin) {
      if(userDetails.isAdmin) {
        return children;
      }
      return <Navigate to="not-found"/>
    }

    if (userRole === UserRole.Student && !userDetails.isAdmin) {
      if(userDetails.isAdmin) {
        return <Navigate to="not-found"/>
      }
      return children
    }

    return <Navigate to='/pending' />;
  }


  return <Navigate to='/pending' />;
}
