import "@/styles/globals.css";
import "@/styles/theme-variables.css";
import Layout from "@/components/layout/Layout";
import { ClerkProvider } from "@clerk/nextjs";
import { UserProvider } from "@/contexts/UserContext";

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </ClerkProvider>
  );
}
