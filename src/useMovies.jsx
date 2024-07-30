import React, { useEffect, useState } from "react";
const KEY = "b0833e1a";

export function UseMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            // `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            `http://www.omdbapi.com/?apikey=b0833e1a&s=${query}`,
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
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
