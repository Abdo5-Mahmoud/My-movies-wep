import { React, useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { Loader } from "./App v3";
import { useKey } from "./useKey";
const KEY = "b0833e1a";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Main({ children }) {
  return (
    <main className="main">
      {/* <ListBox movies={movies} />
      <WatchedBox watched={watched} /> */}
      {children}
    </main>
  );
}

export default Main;

export function Box({ children, element }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && <ul className="list">{children || element}</ul>}
    </div>
  );
}

export function MovieList({ movies, onClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} onClick={onClick} key={movie.imdbID} />
      ))}
    </ul>
  );
}
export function Movie({ movie, onClick }) {
  return (
    <li onClick={() => onClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// export function WatchedBox({ children }) {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && <>{children}</>}
//     </div>
//   );
// }

export function WatchedMovieList({ watched, handleDeleteWatch }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              className="btn-delete"
              onClick={() => handleDeleteWatch(movie.imdbID)}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SelectedMovie({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.curren++;
  }, [userRating]);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  /* eslint-disable */
  // if (imdbRating > 8) [isTop, setIsTop] = useState(true);

  // const [avgRating, setAvgRating] = useState(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime.split(" ").at(0),
      userRating,
      countRatingDecssions: countRef.current,
    };
    // console.log(newWatchedMovie);
    onAddWatched(newWatchedMovie);
    onCloseMovie();

    // setAvgRating(Number(imdbRating));
    // alert(avgRating); //will log 0 because it work Asynchrounusly
    // setAvgRating((x) => (x + userRating) / 2);
  }
  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=b0833e1a&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return function () {
      document.title = "usePopcorn";
      console.log(`the cleanUp effect for selected movie ${title}`); // the closure consept is called (function will remember the vars that were present at the time & the place )
      // يعني الفانكشن هتفتكر المتغيرات فى الوقت الذى تم استدعائها فيه
    };
  }, [title]);

  useKey("Escape", onCloseMovie);
  /*   // هنا قابلتني مشكله ان كل مره بيضيف حدث عشان كده هيرجع cleanupFunction
  useEffect(() => {
    function callback(e) {
      if (e.code === "Escape") {
        // console.log("CLOSING");
        onCloseMovie();
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [onCloseMovie]); */

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} &bull;</p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}IMDb rating
              </p>
            </div>
          </header>
          {/* <p> {avgRating} </p> */}
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating}⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
