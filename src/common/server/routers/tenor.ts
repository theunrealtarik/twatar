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
  /**
   * Retrieves a list of GIFs.
   *
   * @returns {Promise<object>} - A promise that resolves to the retrieved GIFs and pagination information.
   * @description Retrieves a list of GIFs based on the provided input parameters. The `cursor` property can be used for pagination, fetching the next set of results. The `query` property allows filtering GIFs by a specific search keyword.
   *
   * If no `query` is provided, the endpoint retrieves a list of featured GIFs. If a `query` is provided, it performs a search and returns matching GIFs.
   *
   * The promise resolves to an object with the retrieved GIFs and pagination information. The `next` property indicates the cursor for the next page of results (if available), and the `gifs` property contains an array of the retrieved GIFs.
   */

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
