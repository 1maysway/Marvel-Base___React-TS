import React, { useLayoutEffect, useState } from 'react';
import { debounce } from "lodash"


export default function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    const debouncedSize = debounce(updateSize, 300)

    window.addEventListener('resize', debouncedSize);
    updateSize();
    return () => window.removeEventListener('resize', debouncedSize);
  }, []);
  return size;
}