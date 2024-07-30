import { useEffect, useState } from "react";

export function useLocalstorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    // console.log(storedValue);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });
  /// this effect will fetch the data that the user search for (query)
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value)); // one method to put the watched list in the local storage
  }, [value, key]);
  return [value, setValue];
}
