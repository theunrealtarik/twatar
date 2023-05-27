import { withSession } from "@/common/middlewares";
import { type NextPage } from "next";

import { AppLayout, Feed, SharePost } from "@/components";

const Home: NextPage<{ user: IUser }> = ({ user }) => {
  return (
    <AppLayout user={user}>
      <SharePost user={user} />
      <Feed />
    </AppLayout>
  );
};

export const getServerSideProps = withSession(false);
export default Home;
