import { withSession } from "@/common/middlewares";
import { AppLayout, Feed, UserAvatar } from "@/components";
import { Tab } from "@headlessui/react";
import type { NextPage } from "next";
import type { IconType } from "react-icons";
import { type FC, useEffect } from "react";
import { useRouter } from "next/router";

import { FiTwitter, FiUser } from "react-icons/fi";
import { api } from "@/common/server/api";
import { useScroll } from "@/hooks";
import { classNames } from "@/common/lib/utils";
import Link from "next/link";

interface SearchPageProps {
  user: IUser;
}

const SearchPage: NextPage<SearchPageProps> = ({ user }) => {
  const router = useRouter();
  const query = router.query.q as string;

  return (
    <AppLayout user={user}>
      <Tab.Group>
        <Tab.List className="inline-flex w-full divide-x border-b border-gray-300 dark:divide-neutral-600 dark:border-neutral-600">
          <SearchTab Icon={FiTwitter} label="Twats" />
          <SearchTab Icon={FiUser} label="Users" />
        </Tab.List>
        <Tab.Panels className="p-4">
          <Tab.Panel>
            <Feed filters={{ contains: query }} />
          </Tab.Panel>
          <Tab.Panel>
            <UsersList filters={{ username: query }} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </AppLayout>
  );
};

const SearchTab: FC<{ label: string; Icon: IconType }> = ({ label, Icon }) => {
  return (
    <Tab
      as={"button"}
      className="relative inline-flex w-full items-center justify-center gap-x-2 py-4 outline-none"
      aria-label={label.concat(" tab")}
    >
      {({ selected }) => (
        <>
          <Icon />
          <span>{label}</span>
          {selected && (
            <span className="absolute bottom-0 w-full bg-sky-500 py-1"></span>
          )}
        </>
      )}
    </Tab>
  );
};

/**
 * A component that displays a list of users
 */
const UsersList: FC<{
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
  const scrollPos = useScroll(null);

  useEffect(() => {
    if (scrollPos > 90 && users.hasNextPage && !users.isFetching) {
      users.fetchNextPage();
    }
  }, [scrollPos]);

  const data =
    users.data?.pages && users.data.pages.flatMap((page) => page.users);

  return (
    <div className="space-y-4">
      {users.isLoading && <UsersSkeletons />}
      {data &&
        data.map((user) => (
          <div className="inline-flex w-full items-center gap-4">
            <UserAvatar src={user.image} />
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

const UsersSkeletons: FC = () => {
  return (
    <>
      {[...new Array(6)].map((_, i) => (
        <div className="inline-flex w-full items-center gap-2">
          <div
            className={classNames(
              "h-16 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-neutral-800"
            )}
          ></div>
          <span className="h-4 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800"></span>
        </div>
      ))}
    </>
  );
};

export const getServerSideProps = withSession(true);
export default SearchPage;
