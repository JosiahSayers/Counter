import { createContext, useState, type PropsWithChildren } from "react";

export const CountContext = createContext({
  count: 0,
  setCount: (newCount: number) => {},
});

export function CountProvider({ children }: PropsWithChildren) {
  const [count, setCount] = useState(0);

  return (
    <CountContext.Provider
      value={{
        count,
        setCount,
      }}
    >
      {children}
    </CountContext.Provider>
  );
}
