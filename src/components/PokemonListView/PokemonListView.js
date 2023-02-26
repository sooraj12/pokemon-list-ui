import { PokemonListProvider } from "./PokemonListProvider";
import { PokemonSearch } from "./PokemonSearch";
import { PokemonList } from "./PokemonList";

function PokemonListView() {
  return (
    <div className="bg-[#f2f9fb] h-screen rounded-lg p-5 flex flex-col">
      <PokemonListProvider>
        <PokemonSearch />
        <PokemonList />
      </PokemonListProvider>
    </div>
  );
}

export { PokemonListView };
