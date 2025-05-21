// lib/fetcher.ts
import { getSession } from "next-auth/react";

type FetcherArgs = [string, RequestInit?];

const fetcher = async (...args: FetcherArgs) => {
  const [url, config = {}] = args;

  const session = await getSession();
  const sessionToken = (session?.user as any)?.access_token;

  if (!sessionToken) {
    throw new Error("No access token in session");
  }

  const res = await fetch(url, {
    ...config,
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      ...(config.headers ?? {}),
    },
  });

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // @ts-ignore
    error.info = await res.json();
    // @ts-ignore
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export default fetcher;
