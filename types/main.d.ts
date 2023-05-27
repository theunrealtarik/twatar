import type { User, Post } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare global {
  interface IUser extends User {
    posts: Post[];
    followers: User[];
    following: User[];
  }

  interface IPost extends Post {}

  type WithSessionReturn = {
    user: IUser | null;
  };

  // tenor
  interface TenorResponse {
    results: GIF[];
    next: string;
  }

  interface TenorRequestParams {
    key?: string;
    limit?: number;
    searchfilter?: string;
    media_filter?: string;
    q?: string;
    pos: string;
  }

  interface GIF {
    id: string;
    title: string;
    media_formats: {
      gif?: {
        url: string;
        duration: number;
        preview: string;
        dims: [number, number];
        size: number;
      };
    };
    created: number;
    content_description: string;
    itemurl: string;
    url: string;
    tags: string[];
    flags: string[];
    hasaudio: boolean;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export {};
