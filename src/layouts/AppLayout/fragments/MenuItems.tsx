import Link from "next/link";

import type { NextRouter } from "next/router";
import { SideMenuLinks } from "../data";
import { classNames } from "@/common/lib/utils";

const MenuItems = (router: NextRouter, user: IUser | null) => {
  return Array.from(SideMenuLinks).map(
    ([pathname, { label, authRequired, Icon }], index) => {
      pathname = index === 1 ? `/profile?id=${user?.id}` : pathname;
      const isActive = router.asPath.endsWith(pathname);

      if (!authRequired || (authRequired && !!user))
        return (
          <li key={index} className={classNames(isActive ? "font-bold" : "")}>
            <Link
              className="inline-flex w-full items-center gap-x-2 rounded-full px-2 py-2 transition-colors hover:bg-gray-200 dark:hover:bg-neutral-900"
              href={pathname}
              replace
            >
              <Icon />
              <span className="hidden md:block">{label}</span>
            </Link>
          </li>
        );
    }
  );
};

export default MenuItems;
