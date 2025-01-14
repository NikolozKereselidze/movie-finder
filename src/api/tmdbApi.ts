import { SearchResult } from "../types/search";

const BASE_URL = "https://api.themoviedb.org/3";
const BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
};

/**
 * Search movies by query
 * @param query - Search term (e.g., "Interstellar")
 * @returns Promise of an array of movies, series, persons
 */

export const searchAll = (query: string): Promise<SearchResult[]> => {
  const url = `${BASE_URL}/search/multi?query=${query}&include_adult=false&language=en-US&page=1`;
  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.results.length === 0) {
        throw new Error("Not Found");
      }
      return fetchResult(data);
    });
};

export const fetchTrendingMovies = async (): Promise<SearchResult[]> => {
  const response = await fetch(
    "https://api.themoviedb.org/3/trending/all/day?language=en-US",
    options
  );

  const data = await response.json();

  if (data.results.length === 0) {
    throw new Error("No trending movies found.");
  }

  return data.results;
};

export const fetchResult = (
  data:
    | {
        results: SearchResult[];
      }
    | SearchResult
): Promise<SearchResult[]> => {
  const resultsArray = "results" in data ? data.results : [data];

  return Promise.all(
    resultsArray.map(async (item: SearchResult): Promise<SearchResult> => {
      if (item.media_type === "movie" || item.media_type === "tv") {
        const detailsUrl = `${BASE_URL}/${item.media_type}/${item.id}?language=en-US`;
        const detailsResponse = await fetch(detailsUrl, options);
        const details = await detailsResponse.json();

        return {
          ...item,
          runtime: details.runtime,
          genres: details.genres.map((genre: { name: string }) => genre.name),
          seasons: details.number_of_seasons,
          releaseYear: details.release_date?.split("-")[0],
          ageRating: details.adult ? "18+" : "13+",
        };
      }
      return item;
    })
  );
};

export const fetchRecommendations = async (
  mediaType: string,
  id: number
): Promise<SearchResult[]> => {
  const url = `${BASE_URL}/${mediaType}/${id}/recommendations?language=en-US`;
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Error fetching recommendations: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.results.length === 0) {
    throw new Error("No recommendations found.");
  }

  const detailedRecommendations = await fetchResult({ results: data.results });

  return detailedRecommendations;
};
