import { seriesData } from "./learnData";

type EpisodeContentMap = Record<string, Record<string, string>>;

const normalizeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const titleToSeriesId = new Map(
  seriesData.map((series) => [normalizeKey(series.title), series.id])
);

function parseEpisodeContentMap(rawText: string): EpisodeContentMap {
  const cleaned = rawText.replace(/\r/g, "").replace(/\f/g, "\n");
  const lines = cleaned.split("\n");
  const map: EpisodeContentMap = {};

  let currentSeriesId: string | null = null;
  let currentEpisodeId: string | null = null;
  let buffer: string[] = [];

  const flushEpisode = () => {
    if (!currentSeriesId || !currentEpisodeId) {
      buffer = [];
      return;
    }

    const body = buffer
      .filter((line) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return true;
        }

        // Remove editorial metadata headers from episode bodies.
        return !/^(length|pace)\s*:/i.test(trimmed);
      })
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!map[currentSeriesId]) {
      map[currentSeriesId] = {};
    }

    map[currentSeriesId][currentEpisodeId] = body;
    buffer = [];
  };

  for (const line of lines) {
    const seriesMatch = line.match(/^Series\s+\d+:\s+(.+)$/i);
    if (seriesMatch) {
      flushEpisode();
      currentEpisodeId = null;
      const seriesTitle = normalizeKey(seriesMatch[1]);
      currentSeriesId = titleToSeriesId.get(seriesTitle) ?? null;
      continue;
    }

    const episodeMatch = line.match(/^Episode\s+(\d+):\s+(.+)$/i);
    if (episodeMatch) {
      flushEpisode();
      currentEpisodeId = String(Number(episodeMatch[1]));
      buffer = [];
      continue;
    }

    if (currentSeriesId && currentEpisodeId) {
      buffer.push(line);
    }
  }

  flushEpisode();
  return map;
}

let primaryContentMapCache: EpisodeContentMap | null = null;
let additionalContentMapCache: EpisodeContentMap | null = null;
let primaryLoaderPromise: Promise<EpisodeContentMap> | null = null;
let additionalLoaderPromise: Promise<EpisodeContentMap> | null = null;

const additionalSeriesIds = new Set<string>(["it-works-1926", "the-great-within-1907", "in-tune-with-the-infinite-1897"]);

function isAdditionalSeries(seriesId: string): boolean {
  return additionalSeriesIds.has(seriesId);
}

async function loadPrimaryContentMap(): Promise<EpisodeContentMap> {
  if (primaryContentMapCache) {
    return primaryContentMapCache;
  }

  if (!primaryLoaderPromise) {
    primaryLoaderPromise = import("../Within_App_Series_1_9.txt?raw").then((module) => {
      const map = parseEpisodeContentMap(module.default);
      primaryContentMapCache = map;
      return map;
    });
  }

  return primaryLoaderPromise;
}

async function loadAdditionalContentMap(): Promise<EpisodeContentMap> {
  if (additionalContentMapCache) {
    return additionalContentMapCache;
  }

  if (!additionalLoaderPromise) {
    additionalLoaderPromise = import("../Within_App_Series_10_12.txt?raw").then((module) => {
      const map = parseEpisodeContentMap(module.default);
      additionalContentMapCache = map;
      return map;
    });
  }

  return additionalLoaderPromise;
}

export async function getEpisodeContent(seriesId: string, episodeId: string): Promise<string> {
  const map = isAdditionalSeries(seriesId)
    ? await loadAdditionalContentMap()
    : await loadPrimaryContentMap();

  return map[seriesId]?.[episodeId] ?? "";
}
