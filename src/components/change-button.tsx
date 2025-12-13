import { CountContext } from "@/CountContext";
import useAxios from "axios-hooks";
import { useContext, useEffect, useState } from "react";
import "./change-button.css";
import { Spinner } from "./spinner";

interface Props {
  method: "increment" | "decrement";
}

const icons: Record<Props["method"], string> = {
  increment: "+",
  decrement: "-",
};

export function ChangeButton({ method }: Props) {
  const [{ data, loading }, execute] = useAxios<{ count: number }>(
    { url: `/api/${method}`, method: "POST" },
    { manual: true }
  );
  const { setCount } = useContext(CountContext);

  useEffect(() => {
    if (data?.count !== undefined) {
      setCount(data.count);
    }
  }, [data]);

  return (
    <button onClick={() => execute()} disabled={loading}>
      {loading ? <Spinner /> : icons[method]}
    </button>
  );
}
