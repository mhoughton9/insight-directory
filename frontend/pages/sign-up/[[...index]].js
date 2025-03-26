import { SignUp } from '@clerk/nextjs';
import Head from 'next/head';
import { Heading, Text } from '../../components/ui/Typography';

const SignUpPage = () => (
  <>
    <Head>
      <title>Create Account | Insight Directory</title>
      <meta name="description" content="Create an account on Insight Directory to save your favorite resources and leave comments" />
    </Head>
    <div className="flex justify-center items-center min-h-screen bg-neutral-50 py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <Heading as="h1" size="2xl" className="mb-6 text-center">
          Create an Insight Directory Account
        </Heading>
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
        <Text size="sm" className="text-neutral-500 mt-6 text-center">
          By signing up, you'll be able to save your favorite resources and leave comments to help others on their spiritual journey.
        </Text>
      </div>
    </div>
  </>
);

export default SignUpPage;
