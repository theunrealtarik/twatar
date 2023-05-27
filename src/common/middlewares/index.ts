import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "../server/auth";
import { SerializeUser, redirect } from "../lib/utils";
import { User } from "@prisma/client";
import { prisma } from "../server/db";

export const withSession = (forceAuth?: boolean, gssp?: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext) => {
    const session = await getServerAuthSession(context);

    if (!!forceAuth && (!session || !session.user)) {
      return redirect("/");
    }

    const user = await prisma.user.findUnique({
      where: { id: session?.user.id ?? "" },
      include: {
        followers: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        following: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const serializedUserObject = user ? SerializeUser(user) : null;

    return {
      props: {
        user: serializedUserObject,
      },
    };
  };
};
