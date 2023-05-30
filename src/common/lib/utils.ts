import moment from "moment";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export function classNames(...classes: string[]) {
  return classes.join(" ");
}

export function shortFormatNumber(n: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(n);
}

export function relativeFormatTime(d: Date) {
  const past = moment(d);
  return past.fromNow();
}

export function redirect(path: string) {
  return {
    redirect: {
      destination: path,
      permanent: false,
    },
  };
}

export function randInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  if (min < max) {
    [min, max] = [max, min];
  }

  return Math.floor(Math.random() * (max - min) + min);
}

export function SerializeUser(user: any) {
  return {
    ...user,
    createdAt: user.createdAt.getTime(),
  };
}

export function signIn() {
  import("next-auth/react").then(({ signIn }) => signIn("discord"));
}
