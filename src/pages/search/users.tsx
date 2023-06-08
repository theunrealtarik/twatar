import { withSession } from "@/common/middlewares";
import { api } from "@/common/server/api";
import { Loading, UserAvatar } from "@/components";
import { useScroll } from "@/hooks";
import { AppLayout, SearchLayout } from "@/layouts";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface UsersPageProps {
  user: IUser | null;
}

const UsersPage: NextPage<UsersPageProps> = ({ user }) => {
  const router = useRouter();
  const query = router.query.q as string;
  return (
    <AppLayout user={user} hideHeader searchPath="/search/users">
      <SearchLayout>
        <Users filters={{ username: query }} />
      </SearchLayout>
    </AppLayout>
  );
};

/**
 * A component that displays a list of users
 */
const Users: React.FC<{
  filters: {
    username?: string | undefined;
  };
}> = ({ filters: { username } }) => {
  const users = api.users.useInfiniteQuery(
    {
      name: username,
    },
    {
      getNextPageParam: ({ nextCursor }) => nextCursor,
    }
  );
  const scrollPos = useScroll();

  useEffect(() => {
    if (scrollPos > 90 && users.hasNextPage && !users.isFetching) {
      users.fetchNextPage();
    }
  }, [scrollPos]);

  const data =
    users.data?.pages && users.data.pages.flatMap((page) => page.users);

  return (
    <div className="space-y-4">
      {users.isLoading && <Loading />}
      {data &&
        data.map((user) => (
          <div className="inline-flex w-full items-center gap-4" key={user.id}>
            <UserAvatar size="sm" src={user.image} />
            <Link
              href={{
                pathname: "/profile/",
                query: {
                  id: user.id,
                },
              }}
              key={user.id}
            >
              <span className="font-bold hover:underline">{user.name}</span>
            </Link>
          </div>
        ))}
    </div>
  );
};

export const getServerSideProps = withSession(true);
export default UsersPage;
