import { useEffect, useState } from "react";
import Nav, { Logo, Results, Search } from "./Nav";
import Main, {
  Box,
  ListBox,
  Movie,
  MovieList,
  SelectedMovie,
  WatchedBox,
  WatchedMovieList,
} from "./Main";
import { Summary } from "./Summary";

const KEY = "b0833e1a";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("inception");
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("WatchedList");
    console.log(storedValue);
    return JSON.parse(storedValue);
  });

  // const tempQuery = "interstellar";

  // useEffect(() => {
  //   console.log("After the initial render");
  // }, []);
  // useEffect(() => {
  //   console.log("After every render");
  // });

  // useEffect(() => {
  //   console.log("After every change of the query(search bar)");
  // }, [query]);
  // console.log("During render");
  function handleSelecetMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    setWatched((mov) => [...mov, movie]);
    // localStorage.setItem("WatchedList", JSON.stringify([...watched, movie]));  // one method to put the watched list in the local storage
    // if (watched.length > 0) {
    //   setWatched((mov) =>
    //     mov.map((myWatched) =>
    //       myWatched.imdbID === movie.imdbID ? movie : myWatched
    //     )
    //   );
    // } else {
    //   setWatched((mov) => [...mov, movie]);
    // }
  }
  function handleDeleteWatch(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  /// this effect will fetch the data that the user search for (query)
  useEffect(() => {
    localStorage.setItem("WatchedList", JSON.stringify(watched)); // one method to put the watched list in the local storage
  }, [watched]);
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          // console.log(res);
          if (!res.ok) throw new Error("Something Went Wrong with fetching");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          setMovies(data.Search);
          setError("");
          // console.log(movies); // well get at first [] because it's asyncronus
        } catch (err) {
          // console.log(err.message);
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return (
    <>
      {/* <nav className="nav-bar">
        <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div> 
        <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
      </nav> */}
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </Nav>
      <Main>
        {/* <Box element={<Movie movies={movies} />} />
        <Box
          element={
            <>
              <Summary watched={watched} />
              {watched.map((movie) => (
                <WatchedMovieList movie={movie} key={movie.imdbID} />
              ))}
            </>
          }
        /> */}
        <Box element={<Movie movies={movies} />}>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieList movies={movies} onClick={handleSelecetMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              onAddWatched={handleAddWatch}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMovieList
                watched={watched}
                handleDeleteWatch={handleDeleteWatch}
              />
            </>
          )}
        </Box>
      </Main>

      {/* <main className="main">
        <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen1((open) => !open)}
          >
            {isOpen1 ? "–" : "+"}
          </button>
          {isOpen1 && (
            <ul className="list">
              {movies?.map((movie) => (
                <li key={movie.imdbID}>
                  <img src={movie.Poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓</span>
                      <span>{movie.Year}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 && (
            <>
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

              <ul className="list">
                {watched.map((movie) => (
                  <li key={movie.imdbID}>
                    <img src={movie.Poster} alt={`${movie.Title} poster`} />
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
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main> */}
    </>
  );
}
export function Loader() {
  return <p className="loader">Loading....</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>📛</span>
      {message}
    </p>
  );
}
