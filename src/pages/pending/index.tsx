import { Icons } from "@/components/Icons";
import UserService from "@/service/UserService";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

export default function Pending() {
  const navigate = useNavigate();
  const { data: userDetails, isLoading } = useQuery({
    queryKey: ["get-user"],
    queryFn: UserService.getUser,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    if (userDetails?.isPending === false) {
      navigate("/home");
      return;
    }

    if (!userDetails && !isLoading) {
      addUserToPendingList();
      return;
    }
  }, [userDetails, isLoading, navigate]);

  const addUserToPendingList = async function () {
    toast.success("İstifadəçi gözləmə listinə əlavə edildi");
  };
  return (
    <div className='flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
      <div className='w-full space-y-6 text-center'>
        <div className='space-y-3 flex flex-col items-center'>
          <div className='w-20'>
            <Icons.loading />
          </div>
          <p className='text-gray-500'>
            Sizin sistemə girişiniz, admin təsdiq verdikdən sonra baş tutacaq.
          </p>
        </div>
      </div>
    </div>
  );
}
