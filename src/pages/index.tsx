import { withSession } from "@/common/middlewares";
import { type NextPage } from "next";

import { AppLayout, Feed, TwatCreate } from "@/components";

const Home: NextPage<{ user: IUser }> = ({ user }) => {
  return (
    <AppLayout user={user}>
      <TwatCreate user={user} />
      <Feed />
    </AppLayout>
  );
};

export const getServerSideProps = withSession(false);
export default Home;
