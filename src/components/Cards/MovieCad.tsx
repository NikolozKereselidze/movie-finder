import { SearchResult } from "../../types/search";
import styles from "../../styles/MovieCard.module.css";
import { CalendarIcon, StarIcon } from "@heroicons/react/24/solid";

interface MovieCardProps {
  item: SearchResult;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  return (
    <>
      {item.poster_path && (
        <img
          className={styles.movieImg}
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={`${item.title} poster`}
        />
      )}

      <div className={styles.info}>
        <h2>{item.name || item.title}</h2>
        <div className={styles.detail}>
          <CalendarIcon className={styles.calendarIcon} />
          <h3>{item.release_date || item.first_air_date}</h3>
        </div>
        <div className={styles.detail}>
          <StarIcon className={styles.starIcon} />
          <h3>{item.vote_average?.toFixed(2)}</h3>
        </div>
      </div>
    </>
  );
};

export default MovieCard;