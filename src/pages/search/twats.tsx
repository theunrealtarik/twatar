import { withSession } from "@/common/middlewares";

import type { NextPage } from "next";
import { useRouter } from "next/router";

import { AppLayout, SearchLayout } from "@/layouts";
import { Feed } from "@/components";

interface TwatsPageProps {
  user: IUser;
}

const TwatsPage: NextPage<TwatsPageProps> = ({ user }) => {
  const router = useRouter();
  const query = router.query.q as string;

  return (
    <AppLayout user={user} hideHeader={true}>
      <SearchLayout>
        <Feed filters={{ contains: query }} />
      </SearchLayout>
    </AppLayout>
  );
};

export const getServerSideProps = withSession(true);
export default TwatsPage;
