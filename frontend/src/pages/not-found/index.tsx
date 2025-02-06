import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className='flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
      <div className='w-full space-y-6 text-center'>
        <div className='space-y-3'>
          <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl animate-bounce'>
            404
          </h1>
          <p className='text-gray-500'>
            Axtardığınız səhifə tapılmadı. Səhifənin ünvanının düzgünlüyünə əmin
            olun.
          </p>
        </div>
        <Link to='/home'>
          <Button className='mt-4'>
            Ana səhifə
            <Home />
          </Button>
        </Link>
      </div>
    </div>
  );
}
