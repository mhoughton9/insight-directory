import { SignIn } from '@clerk/nextjs';
import Head from 'next/head';
import { Heading } from '../../components/ui/Typography';

const SignInPage = () => (
  <>
    <Head>
      <title>Sign In | Insight Directory</title>
      <meta name="description" content="Sign in to your Insight Directory account" />
    </Head>
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <Heading as="h1" size="2xl" className="mb-6 text-center">
          Sign In to Insight Directory
        </Heading>
        <SignIn 
          path="/sign-in" 
          routing="path" 
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-neutral-800 hover:bg-neutral-700 text-white',
              card: 'bg-white shadow-none',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'border border-neutral-200 hover:bg-neutral-50',
            }
          }}
        />
      </div>
    </div>
  </>
);

export default SignInPage;
