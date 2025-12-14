import useAxios from "axios-hooks";
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
  const [{ loading }, execute] = useAxios<{ count: number }>(
    { url: `/api/${method}`, method: "POST" },
    { manual: true }
  );

  return (
    <button onClick={() => execute()} disabled={loading}>
      {loading ? <Spinner /> : icons[method]}
    </button>
  );
}
