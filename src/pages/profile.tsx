import { api } from "@/common/server/api";
import { withSession } from "@/common/middlewares";
import type { NextPage } from "next";

import { useRouter } from "next/router";
import { shortFormatNumber, signIn } from "@/common/lib/utils";

import { FiCalendar } from "react-icons/fi";
import {
  AppLayout,
  Button,
  Error,
  Feed,
  Loading,
  UserAvatar,
} from "@/components";

const Profile: NextPage<ProfilePageProps> = ({ user }) => {
  const router = useRouter();

  const following = api.user.following.useMutation({
    onSuccess: () => profile.refetch(),
  });
  const profile = api.profile.useQuery({ userId: router.query.id as string });

  if (profile.isError) {
    return (
      <AppLayout user={user}>
        <div className="grid h-screen w-full place-content-center">
          <div className="flex flex-col items-center gap-y-8">
            <Error className="h-48 w-48" />
            <div className="w-fit text-3xl font-bold">
              <p>AMIGO YOUR MAMA IS TOO BIG!!!</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (profile.isLoading && profile.data == null) {
    return (
      <AppLayout user={user}>
        <div className="py-16">
          <Loading />
        </div>
      </AppLayout>
    );
  }

  const isUserFollower = profile.data?.followers.some(
    ({ id }) => id === user?.id
  );

  const formattedFollowersNumber = shortFormatNumber(
    profile.data?.followers.length as number
  );
  const formattedFollowingNumber = shortFormatNumber(
    profile.data?.following.length as number
  );

  const commit = (action: "unfollow" | "follow") => {
    following.mutate({
      targetId: profile.data?.id as string,
      action: action,
    });
  };

  return (
    <AppLayout user={user}>
      <div className="space-y-2">
        <div className="flex flex-col">
          <div className="h-32 w-full bg-gray-200 dark:bg-neutral-800"></div>
          <div className="-mt-16 inline-flex w-full justify-between px-6">
            <UserAvatar
              size="lg"
              src={profile.data?.image ?? null}
              className="w-23 ring-6 h-32 w-32 ring-4 ring-white dark:ring-sky-600"
            />
            {profile.data?.id !== user?.id && (
              <div className="flex flex-col justify-end">
                {isUserFollower ? (
                  <Button
                    onClick={() => (user ? commit("unfollow") : void signIn())}
                    intent="secondary"
                  >
                    Following
                  </Button>
                ) : (
                  <Button
                    onClick={() => (user ? commit("follow") : void signIn())}
                  >
                    Follow
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="px-6">
          <div className="mt-4">
            <h4 className="text-2xl font-bold">{profile.data?.name}</h4>
            <span className="font-medium text-gray-400">
              {profile.data?.id}
            </span>
          </div>
          <div className="my-2 inline-flex items-center justify-start gap-x-2 text-gray-400">
            <FiCalendar />
            <span>
              {new Date(profile.data?.createdAt ?? "").toDateString()}
            </span>
          </div>
          <br />
          <div className="inline-flex justify-between gap-x-4">
            <div className="space-x-2">
              <span className="text-gray-400">followers</span>
              <span className="font-bold">{formattedFollowersNumber}</span>
            </div>
            <div className="space-x-2">
              <span className="text-gray-400">following</span>
              <span className="font-bold">{formattedFollowingNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-16 px-4 font-bold">
        <span>Twats</span>
      </h4>
      <Feed filters={{ profileId: profile.data?.id }} />
    </AppLayout>
  );
};

interface ProfilePageProps {
  user: IUser | null;
}

export const getServerSideProps = withSession(false);
export default Profile;
