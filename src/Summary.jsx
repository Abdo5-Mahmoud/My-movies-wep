import { React } from "react";
import { average } from "./Main";

export function Summary({ watched }) {
  const avgImdbRating = average((watched.map((movie) => movie.imdbRating)));
  const avgUserRating = average((watched.map((movie) => movie.userRating)));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  // console.log(watched);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
