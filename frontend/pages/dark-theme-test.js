import Head from 'next/head';
import DarkThemeWrapper from '../components/layout/DarkThemeWrapper';
import { Text } from '../components/ui/Typography';
import Link from 'next/link';

export default function DarkThemeTest() {
  return (
    <DarkThemeWrapper>
      <Head>
        <title>Dark Theme Test | Insight Directory</title>
        <meta name="description" content="Testing the dark theme implementation" />
      </Head>

      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6 text-[var(--text-heading)]">
          Dark Theme Test Page
        </h1>
        
        <div className="mb-8">
          <p className="mb-4 text-[#F5F6F8] text-lg">
            This page demonstrates the dark theme implementation for Insight Directory.
            It shows how the core layout components (header, footer) and basic elements look with the dark theme applied.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card Example */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-3 text-[#F5F6F8]">
              Card Example
            </h2>
            <p className="text-[#F5F6F8] mb-4 text-base">
              This is how cards will look in the dark theme. The background is slightly lighter than the page background.
            </p>
            <div className="flex justify-end">
              <button>
                Primary Button
              </button>
            </div>
          </div>

          {/* Secondary Card */}
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-3 text-[#F5F6F8]">
              Secondary Card
            </h2>
            <p className="text-[#F5F6F8] mb-2 text-base">
              This shows text styling with the dark theme.
            </p>
            <p className="text-[#9CA3B0] text-sm mb-4">
              This is secondary text in a muted color to show hierarchy.
            </p>
            <div className="flex justify-end">
              <button>
                Secondary Button
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-8 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3 text-[#F5F6F8]">Secondary Button on Main Background</h3>
            <p className="text-[#9CA3B0] mb-4">This shows how the secondary button looks directly on the site background</p>
            <button>
              Learn More
            </button>
          </div>
          
          <Link href="/" className="text-[#1E90FF] hover:underline hover:text-[#4BA5FF] transition-colors duration-300 mt-4">
            Return to Home
          </Link>
        </div>
      </div>
    </DarkThemeWrapper>
  );
}
