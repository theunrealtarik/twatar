import { env } from "@/env.mjs";
import { createTRPCRouter, publicProcedure } from "../api/trpc";
import axios from "axios";
import { z } from "zod";

const baseURL = "https://tenor.googleapis.com/v2/";
const fetch = axios.create({
  params: {
    key: env.TENOR_SECRET,
    limit: 20,
    media_filter: "gif",
  },
  baseURL,
});

export default createTRPCRouter({
  gifs: publicProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        query: z.string().nullish(),
      })
    )
    .query(async ({ input: { cursor, query } }) => {
      const endpoint = !query ? "/featured" : "/search";
      const params = (!!cursor ? { pos: cursor } : {}) as TenorRequestParams;

      if (query) params.q = query;

      const { data, status } = await fetch.get<TenorResponse>(endpoint, {
        params,
      });

      return {
        next: data.next,
        gifs: data.results,
      };
    }),
});
