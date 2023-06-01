import { withSession } from "@/common/middlewares";
import { api } from "@/common/server/api";
import { AppLayout, Loading, TwatCard } from "@/components";

import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

const TwatPage: NextPage<TwatPageProps> = ({ user }) => {
  const router = useRouter();
  if (!router.isReady) return null;

  const twat = api.twats.get.useQuery({ tid: router.query.id as string });

  if (twat.isLoading) {
    return <Loading />;
  }

  return (
    <AppLayout hideHeader={true} user={user}>
      <div className="p-4">
        {twat.data && (
          <TwatCard link={false} lineClamp={false} data={twat.data} />
        )}
      </div>
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(false);

interface TwatPageProps {
  user: IUser;
}

export default TwatPage;
