import seriesSourceText from "../../../imports/Within_App_Series_1_9.txt?raw";
import additionalSeriesSourceText from "../../../imports/Within_App_Series_10_12.txt?raw";
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

const episodeContentMap = parseEpisodeContentMap(
  `${seriesSourceText}\n\n${additionalSeriesSourceText}`
);

export function getEpisodeContent(seriesId: string, episodeId: string): string {
  return episodeContentMap[seriesId]?.[episodeId] ?? "";
}
