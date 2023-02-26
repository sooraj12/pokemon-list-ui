import { useContext } from "react";
import { PokemonContext } from "../../components/PokemonListView/PokemonListProvider";

function usePokemonListProvider() {
  const {
    searchTerm,
    keywords,
    sestSearchTerm,
    fetchNames,
    fetchList,
    recents,
    setRecentKeyword,
    names,
    updateListItems,
    list,
  } = useContext(PokemonContext);
  return {
    searchTerm,
    keywords,
    sestSearchTerm,
    fetchNames,
    fetchList,
    recents,
    setRecentKeyword,
    names,
    updateListItems,
    list,
  };
}

export { usePokemonListProvider };
