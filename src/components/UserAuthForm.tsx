import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import UserService from "@/service/UserService";
import OAuthSignIn from "@/supabase/OAuth";

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    signIn();
  }

  async function signIn() {
    UserService.signUp({ email: "jfun3825@gmail.com", password: "12345678" });
  }

  const oAuthLogin = async function () {
    await OAuthSignIn();
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              disabled
              id='email'
              placeholder='Email'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
            />
          </div>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='password'>
              Şifrə
            </Label>
            <Input
              disabled
              id='password'
              placeholder='Şifrə'
              type='password'
              autoCapitalize='none'
              autoComplete='password'
              autoCorrect='off'
            />
          </div>
          <Button disabled type='submit'>
            Daxil ol
          </Button>
        </div>
      </form>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Digər vasitə ilə davam edin
          </span>
        </div>
      </div>
      <Button onClick={oAuthLogin} variant='outline' type='button'>
        <Icons.google className='mr-2 h-4 w-4' />
        Google
      </Button>
    </div>
  );
}
