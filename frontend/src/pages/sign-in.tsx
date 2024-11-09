import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork a and a a to sign up if you do not have an account. The second column has a cover image.";

const items = [
  {
    id: 1,
    name: 'Faidhi',
    designation: 'Developer',
    image: './../assets/faidhi.jpeg',
  },
];
export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSignIn(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    // check if email and password is null or not
    if (email && password) {
      const success = await login(email, password);
      if (success) {
        console.log('Logged in successfully');
        // Redirect or perform other actions
        return navigate('/');
      } else {
        console.error('Login failed');
        setError('Invalid email or password');
      }
    }

    // console.log(email, password);
    // console.log(email === 'wendellnoi' && password === 'shuyingmia');
    // if (email === 'wendellnoi' && password === 'shuyingmia') {
    //   return navigate('/home');
    // }
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                ref={emailRef}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required ref={passwordRef} />
            </div>
            <p className="text-center text-sm text-red-500">{error}</p>
            <Button
              type="submit"
              className="w-full"
              onClick={(e) => handleSignIn(e)}
            >
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
      {/* <div className="hidden bg-muted lg:block">
        <img
          src="https://bfmcms.s3.ap-southeast-1.amazonaws.com/websiteimages/morning-brief/2024-03-11_bank-negara-malaysia-interest-rates-weak-ringgit-gdp/og_d8a181e2-0f46-4f25-a410-7d820a709d31.png"
          alt="Image"
          // width="920"
          height="500"
          className="mt-28 p-9 w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div> */}
      <BackgroundBeamsWithCollision className="h-full">
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
          What&apos;s cooler than viewing db?{' '}
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span className="">DataBase App!</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              <span className="">DataBase App!</span>
            </div>
          </div>
        </h2>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
