import { useEffect } from "react";
import { SearchSuggestions } from "../../SearchSuggestions";
import { usePokemonListProvider } from "../../../hooks";
import { RecentSearches } from "../RecentSearches";

function PokemonSearch() {
  const {
    searchTerm,
    sestSearchTerm,
    fetchNames,
    recents,
    setRecentKeyword,
    names,
  } = usePokemonListProvider();

  useEffect(() => {
    fetchNames(searchTerm);
  }, [searchTerm, fetchNames]);

  const handleRecentSelect = (term: string) => {
    // set recent if term length is more than 2
    if (term && term.length > 2) {
      setRecentKeyword(term);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <SearchSuggestions
        placeholder="Search Pokemon"
        value={searchTerm}
        onChange={sestSearchTerm}
        items={names}
        getItemKey={(item) => item.id}
        getItemValue={(item) => item.name}
        onBlur={handleRecentSelect}
      />

      <RecentSearches items={recents} onSelect={sestSearchTerm} />
    </form>
  );
}

export { PokemonSearch };
