import { Navigate } from "react-router-dom";

export default function ProtectedRouter({
  children,
}: {
  children: JSX.Element;
}) {
  const isAuthorized = true;

  if (isAuthorized) {
    return children;
  }

  <Navigate to='/not-found' />;
}
