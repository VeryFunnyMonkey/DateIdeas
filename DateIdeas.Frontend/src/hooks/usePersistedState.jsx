// Can use this to persist state in local storage - useful for storing user preferences, etc.
import {useState, useEffect } from "react";
export const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(
      () => JSON.parse(localStorage.getItem(key)) || defaultValue
    );
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }
  