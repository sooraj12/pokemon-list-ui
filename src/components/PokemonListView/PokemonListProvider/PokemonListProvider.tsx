import React from "react";
import { usePokemonList } from "../../../hooks";
import {
  PokemonContextType,
  PokemonContextConfigType,
  PokemonProps,
} from "../../../types";

const PokemonContext = React.createContext<PokemonContextType>(null!);

function PokemonListProvider({ children }: PokemonContextConfigType) {
  const pokemon: PokemonProps = usePokemonList();

  return (
    <PokemonContext.Provider value={pokemon}>
      {children}
    </PokemonContext.Provider>
  );
}

export { PokemonListProvider, PokemonContext };
