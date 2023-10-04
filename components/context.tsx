import { ReactNode, createContext, useContext } from "react";

type StyleContextType = {
  fontSize: number;
  vertical: boolean;
};
export const StyleContext = createContext<StyleContextType>({
  fontSize: 70,
  vertical: false,
});

export function useStyle() {
  return useContext(StyleContext);
}

export function StyleProvider({
  children,
  ...props
}: Partial<StyleContextType> & { children: ReactNode }) {
  const style = useStyle();

  return (
    <StyleContext.Provider
      value={{
        ...style,
        ...props,
      }}
    >
      {children}
    </StyleContext.Provider>
  );
}
