import { writeJSON, readJSON, ensureFile } from "fs-extra";
import Bottleneck from "bottleneck";
import { join } from "path";

type Callback<A extends any[], R> = (...args: A) => Promise<R>;

interface CachedFunction<A extends any[], R> {
  (...args: A): Promise<R>;
  skipCache: Callback<A, R>;
}

const limiter = new Bottleneck({
  maxConcurrent: 1,
});

function withDevCache<A extends any[], R>(
  callback: Callback<A, R>,
  cacheKey: (...args: A) => string,
  // TODO: Add a file option, to cache file
  options: { type?: "memory" | "file"; cacheFileKey?: string } = {}
): CachedFunction<A, R> {
  if (options.type === "file" && !options.cacheFileKey) {
    throw new Error(`withDevCache must specify a cacheFileKey when type=file`);
  }

  const cacheFileKey = options.cacheFileKey ?? "temp";
  const cacheFile = join(__dirname, "../cache/", `${cacheFileKey}.json`);

  const memoryCache: Record<string, R | undefined> = {};

  const getCacheFile = async (): Promise<Record<string, R> | undefined> => {
    try {
      const cacheContents = await readJSON(cacheFile);

      if (!cacheContents) return undefined;
      if (typeof cacheContents !== "object") return undefined;
      if (!cacheContents) return undefined;
      if (Array.isArray(cacheContents)) return undefined;

      return cacheContents;
    } catch {
      return undefined;
    }
  };

  const cache = {
    get: async (key: string): Promise<R | undefined> => {
      if (options.type === "file") {
        return limiter.schedule(async () => {
          const cacheContents = await getCacheFile();

          if (!cacheContents) return;

          return cacheContents[key];
        });
      }

      return memoryCache[key];
    },
    set: async (key: string, value: R): Promise<void> => {
      if (options.type === "file") {
        return limiter.schedule(async () => {
          const cacheContents = await getCacheFile();

          await ensureFile(cacheFile);

          await writeJSON(cacheFile, {
            ...cacheContents,
            [key]: value,
          });
        });
      }

      memoryCache[key] = value;
    },
  };

  async function cachedFn(...args: A): Promise<R> {
    if (!process.env.USE_DEV_CACHE) return callback(...args);

    const key = cacheKey(...args);
    const cachedValue = await cache.get(key);

    if (cachedValue !== undefined) return cachedValue;

    const value = await callback(...args);

    await cache.set(key, value);

    return value;
  }

  cachedFn.skipCache = async (...args: A): Promise<R> => {
    if (!process.env.USE_DEV_CACHE) return callback(...args);

    const key = cacheKey(...args);
    const value = await callback(...args);

    await cache.set(key, value);

    return value;
  };

  return cachedFn;
}

export default withDevCache;
