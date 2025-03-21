import { SignIn } from '@clerk/nextjs';
import Head from 'next/head';

const SignInPage = () => (
  <>
    <Head>
      <title>Sign In | Insight Directory</title>
      <meta name="description" content="Sign in to your Insight Directory account" />
    </Head>
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-medium mb-6 text-center" style={{ fontFamily: 'Lora, serif' }}>
          Sign In to Insight Directory
        </h1>
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
