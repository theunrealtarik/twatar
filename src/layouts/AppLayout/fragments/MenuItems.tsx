import Link from "next/link";

import { classNames } from "@/common/lib/utils";
import { SideMenuLinks } from "../data";
import { NextRouter } from "next/router";

const MenuItems = (router: NextRouter, user: IUser | null) => {
  return Array.from(SideMenuLinks).map(
    ([pathname, { label, authRequired, Icon, regex }], index) => {
      if (index === 1) pathname = pathname.concat("?id=" + user?.id);
      const isActive = regex.test(router.asPath);

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
