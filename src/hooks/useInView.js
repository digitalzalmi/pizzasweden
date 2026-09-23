import { useEffect, useRef, useState } from "react";

const defaultOptions = { threshold: 0.16, rootMargin: "0px 0px -40px 0px" };

export function useInView(options = defaultOptions) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options, visible]);

  return { ref, visible };
}
