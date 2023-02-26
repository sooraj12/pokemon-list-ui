import React from "react";
import { usePokemonList } from "../../../hooks";

const PokemonContext = React.createContext({});

function PokemonListProvider({ children }) {
  const pokemon = usePokemonList();

  return (
    <PokemonContext.Provider value={pokemon}>
      {children}
    </PokemonContext.Provider>
  );
}

export { PokemonListProvider, PokemonContext };
