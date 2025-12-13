import { CountContext } from "@/CountContext";
import useAxios from "axios-hooks";
import { useContext, useEffect } from "react";
import "./count.css";

export function Count() {
  const [{ data: initialCount }] = useAxios<{ count: number }>("/api/count");
  const { count, setCount } = useContext(CountContext);

  useEffect(() => {
    setCount(initialCount?.count ?? 0);
  }, [initialCount]);

  return <h1>{count}</h1>;
}
