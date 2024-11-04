import { UserAuthForm } from "@/components/UserAuthForm";
import { useState } from "react";
import "./Auth.scss";

export default function AuthPage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <>
      <div className='md:hidden'>
        <img
          src='/examples/authentication-light.png'
          width={1280}
          height={843}
          alt='Authentication'
          className='block dark:hidden'
        />
        <img
          src='/examples/authentication-dark.png'
          width={1280}
          height={843}
          alt='Authentication'
          className='hidden dark:block'
        />
      </div>
      <div className='container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div
          className={`relative hidden h-full flex-col bg-muted text-white dark:border-r lg:flex image-wrapper ${
            !isImageLoaded && "animate-pulse"
          }`}
        >
          <img
            onLoad={() => setIsImageLoaded(true)}
            src='/src/assets/auth-bg.webp'
          />
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                MİQ Hazırlığı
              </h1>
              <p className='white text-sm text-muted-foreground'>
                Daxil olmaq üçün aşağıdaki məlumatları doldurun
              </p>
            </div>
            <UserAuthForm />
            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking continue, you agree to our{" "}
              <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
