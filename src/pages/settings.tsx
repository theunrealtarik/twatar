import { withSession } from "@/common/middlewares";
import { type NextPage } from "next";

import { AppLayout } from "@/layouts";
import { Toggle } from "@/components";
import { useTheme } from "@/hooks";

const Settings: NextPage<{ user: IUser }> = ({ user }) => {
  const { setTheme, isToggled } = useTheme();

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
      </div>
    </AppLayout>
  );
};

export const getServerSideProps = withSession(true);
export default Settings;
