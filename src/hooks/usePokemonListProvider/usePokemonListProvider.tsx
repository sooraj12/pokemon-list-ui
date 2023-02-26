import { useContext } from "react";
import { PokemonContext } from "../../components/PokemonListView/PokemonListProvider";
import { PokemonContextType } from "../../types";

function usePokemonListProvider() {
  const pokemon = useContext<PokemonContextType>(PokemonContext);

  if (!pokemon) {
    throw new Error(
      "usePokemonListProvider has to be used within <PokemonListProvider>"
    );
  }
  return pokemon;
}

export { usePokemonListProvider };
