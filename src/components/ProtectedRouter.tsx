import UserService from "@/service/UserService";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedRouter({
  children,
}: {
  children: JSX.Element;
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

  if (isAuthorized) {
    return children;
  }

  return <Navigate to='/pending' />;
}
