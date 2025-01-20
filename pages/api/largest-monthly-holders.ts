import { NextApiRequest, NextApiResponse } from "next";

import * as cache from "@/lib/cache";
import { fetchLargestHoldersForPastMonth } from "@/lib/dune";

const CACHE_KEY = "largest-monthly-holders";
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const rows = await cache.cachedOrFetch(
    CACHE_KEY,
    fetchLargestHoldersForPastMonth
  );

  return res.status(200).json(rows);
}
