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
import { UseMovies } from "./useMovies";
import { useLocalstorage } from "./useLocalStorageState";

const KEY = "b0833e1a";

export default function App() {
  const [query, setQuery] = useState("inception");
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);

  // const { movies, isLoading, error } = UseMovies(query, handleCloseMovie);
  const { movies, isLoading, error } = UseMovies(query);

  const [watched, setWatched] = useLocalstorage([], "watched");
  function handleSelecetMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    setWatched((mov) => [...mov, movie]);
  }
  function handleDeleteWatch(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </Nav>
      <Main>
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
