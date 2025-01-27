import { useEffect, useState } from "react";
import Ad from "../components/Ad";
import Footer from "../components/Footer";
import Search from "../components/Search/Search";
import MultipleCards from "../components/Cards/MultipleCards";
import {
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchTopRatedShows,
  fetchPopularShows,
} from "../api/tmdbApi";
import { SearchResult } from "../types/search";

const FETCH_FUNCTIONS = [
  { fetcher: fetchTrendingMovies, title: "Trending Movies" },
  { fetcher: fetchUpcomingMovies, title: "Upcoming Movies" },
  { fetcher: fetchTopRatedMovies, title: "Must Watch Movies" },
  { fetcher: fetchPopularShows, title: "Trending Shows" },
  { fetcher: fetchTopRatedShows, title: "Must Watch Shows" },
];

const Media = () => {
  const [data, setData] = useState<{ [key: string]: SearchResult[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await Promise.all(
          FETCH_FUNCTIONS.map((item) => item.fetcher())
        );
        const formattedData = FETCH_FUNCTIONS.reduce((acc, curr, index) => {
          acc[curr.title] = results[index];
          return acc;
        }, {} as { [key: string]: SearchResult[] });
        setData(formattedData);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please retry");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Search />
      <div className="section">
        {Object.keys(data).map((key) => (
          <MultipleCards
            id={`${key.replace(/\s/g, "-").toLowerCase()}`}
            title={key}
            results={data[key]}
            defaultShowOnPage={5}
            key={key}
          />
        ))}
        <Ad />
      </div>
      <Footer />
    </>
  );
};

export default Media;
