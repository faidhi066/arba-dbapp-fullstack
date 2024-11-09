import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const description =
  "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a a to login if you already have an account";

export default function LoginPage() {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  function handleRedirect() {
    console.log('click');
    navigate('/');
  }

  async function handleSignIn(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    // check if email and password is null or not
    if (name && email && password) {
      const success = await register(name, email, password);
      if (success) {
        console.log('Logged in successfully');
        // Redirect or perform other actions
        return navigate('/');
      } else {
        console.error('Login failed');
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
            <h1 className="text-3xl font-bold">Register a new account</h1>
            <p className="text-balance text-muted-foreground">
              Fill in the details below to register
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                placeholder="John Doe"
                required
                ref={nameRef}
              />
            </div>
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
              </div>
              <Input id="password" type="password" required ref={passwordRef} />
            </div>
            <Button
              type="submit"
              className="w-full"
              onClick={(e) => handleSignIn(e)}
            >
              Register
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <a href="/signin" className="underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
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
