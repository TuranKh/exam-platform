import { useUserStore } from "@/store/UserStore";
import AdminStatistics from "../statistics/admin";
import UserStatistics from "../statistics/user";

export default function Home() {
  const { userDetails } = useUserStore();

  if (userDetails?.isAdmin) {
    return <AdminStatistics />;
  }

  return <UserStatistics />;
}
