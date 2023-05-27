import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/common/server/api";

import "@/styles/globals.scss";

import Head from "next/head";
import { useTheme } from "@/hooks";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useTheme();

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Twatar</title>
      </Head>
      <div className="dark:bg-black dark:text-neutral-100 dark:text-white">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
