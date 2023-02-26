import { useEffect, useRef } from "react";

function useClickOutside(handler) {
  const elRef = useRef();
  const handlerRef = useRef();
  handlerRef.current = handler;

  useEffect(() => {
    const listener = (event) => {
      if (
        elRef.current &&
        !elRef.current.contains(event.target) &&
        handlerRef.current
      ) {
        handlerRef.current(event);
      }
    };

    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, [elRef, handlerRef]);

  return elRef;
}

export { useClickOutside };
