import { useEffect, useRef } from "react";

function useClickOutside<T extends HTMLElement>(
  handler: (args: Event) => void
) {
  const elRef = useRef<T>(null);
  const handlerRef = useRef<typeof handler>();
  handlerRef.current = handler;

  useEffect(() => {
    const listener: EventListener = (event) => {
      if (
        elRef.current &&
        !elRef.current.contains(event.target as Node) &&
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
