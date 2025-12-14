import { CountContext } from "@/CountContext";
import { useContext, useEffect } from "react";
import "./count.css";
import { subscribeToCount } from "@/websockets";

export function Count() {
  // const [{ data: initialCount }] = useAxios<{ count: number }>("/api/count");
  const { count, setCount } = useContext(CountContext);

  useEffect(() => {
    subscribeToCount((event) => {
      const newCount = Number(event.data);
      setCount(newCount);
    });
  }, []);

  return <h1>{count}</h1>;
}
