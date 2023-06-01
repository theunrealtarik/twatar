import { withSession } from "@/common/middlewares";
import { type NextPage } from "next";

import { AppLayout, Button, Input, Toggle, UserAvatar } from "@/components";
import { useTheme } from "@/hooks";
import { type FormEventHandler, useReducer } from "react";
import { api } from "@/common/server/api";

const Settings: NextPage<{ user: IUser }> = ({ user }) => {
  const { setTheme, isToggled } = useTheme();

  const [profileState, setProfileState] = useReducer(
    (prev: Partial<IUser>, next: Partial<IUser>) => ({
      ...prev,
      ...next,
    }),
    { ...user }
  );

  const profile = api.user.update.useMutation();

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    profile.mutate({
      ...profileState,
    });
  };

  return (
    <AppLayout user={user}>
      <div className="space-y-4 p-4">
        <div className="inline-flex w-full justify-between">
          Enable dark theme
          <Toggle
            toggled={isToggled}
            onToggle={(v) => setTheme(v ? "dark" : "light")}
          />
        </div>
        <form onSubmit={submitHandler} className="space-y-2">
          <span className="font-bold">Profile Customization</span>
          <div className="inline-flex items-start justify-between gap-x-2">
            <UserAvatar
              intent="square"
              size="lg"
              src={profileState.image ?? null}
              className="mx-auto"
            />
            <div className="flex-1 space-y-2">
              <Input
                placeholder="avatar url"
                className="w-full !rounded-lg"
                defaultValue={profileState.image ?? ""}
                disabled={profile.isLoading}
                onChange={(e) => setProfileState({ image: e.target.value })}
              />
              <Input
                placeholder="banner"
                className="w-full !rounded-lg"
                defaultValue={profileState.banner ?? ""}
                disabled={profile.isLoading}
                onChange={(e) => setProfileState({ banner: e.target.value })}
              />
              <Input
                placeholder="username"
                maxLength={25}
                className="w-full !rounded-lg"
                defaultValue={profileState.name ?? ""}
                disabled={profile.isLoading}
                onChange={(e) => setProfileState({ name: e.target.value })}
              />
              <div className="relative">
                <textarea
                  disabled={profile.isLoading}
                  onChange={(e) => setProfileState({ bio: e.target.value })}
                  defaultValue={profileState.bio ?? ""}
                  maxLength={100}
                  placeholder="bio"
                  className="max-h-24 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 font-medium text-gray-600 outline-none disabled:bg-gray-200 disabled:text-gray-400 dark:border-neutral-600 dark:bg-zinc-950 dark:text-gray-400 dark:placeholder:text-zinc-500 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600"
                ></textarea>
                <span className="absolute -bottom-5 left-0 text-sm text-gray-600 dark:text-neutral-600">
                  {profileState.bio ? profileState.bio.length : 0}/100
                </span>
              </div>
            </div>
          </div>
          <Button disabled={profile.isLoading} className="float-right">
            Save
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export const getServerSideProps = withSession(true);
export default Settings;
