import { getServerAuthSession } from "@/common/server/auth";
import { AppLayout } from "@/components";
import type { GetServerSideProps, NextPage } from "next";

interface TwatPageProps {
  user: IUser;
}

const TwatPage: NextPage<TwatPageProps> = ({ user }) => {
  return (
    <AppLayout hideHeader={true} user={user}>
      <div></div>
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  return {
    props: {
      user: session?.user || null,
    },
  };
};
export default TwatPage;
