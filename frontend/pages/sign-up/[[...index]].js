import { SignUp } from '@clerk/nextjs';
import Head from 'next/head';

const SignUpPage = () => (
  <>
    <Head>
      <title>Create Account | Insight Directory</title>
      <meta name="description" content="Create an account on Insight Directory to save your favorite resources and leave comments" />
    </Head>
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-medium mb-6 text-center" style={{ fontFamily: 'Lora, serif' }}>
          Create an Insight Directory Account
        </h1>
        <SignUp 
          path="/sign-up" 
          routing="path" 
          signInUrl="/sign-in"
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
        <p className="text-sm text-neutral-500 mt-6 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
          By signing up, you'll be able to save your favorite resources and leave comments to help others on their spiritual journey.
        </p>
      </div>
    </div>
  </>
);

export default SignUpPage;
