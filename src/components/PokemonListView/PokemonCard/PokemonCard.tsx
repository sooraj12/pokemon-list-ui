import { Pokemon } from "../../../types";

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const statsToShow = ["hp", "speed", "attack", "defense"];
  console.log(pokemon);

  const getSpriteUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  const getStat = (statType: string) => {
    return pokemon.pokemon_v2_pokemonstats.find(({ pokemon_v2_stat }) => {
      return pokemon_v2_stat.name === statType;
    })?.base_stat;
  };

  const getStats = () => {
    return statsToShow.reduce(
      (
        acc: {
          name: string;
          value: number | undefined;
        }[],
        cur: string
      ) => {
        const stat = cur;
        const statValue = getStat(cur);
        return [...acc, { name: stat, value: statValue }];
      },
      []
    );
  };

  const renderTypes = () => {
    const types = pokemon.pokemon_v2_pokemontypes.map((type) => ({
      name: type.pokemon_v2_type.name,
    }));

    return types.map((type) => (
      <span
        key={type.name}
        className="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs mr-1"
      >
        {type.name}
      </span>
    ));
  };

  const renderStats = () => {
    const stats = getStats();
    return stats.map((stat) => {
      return (
        <div key={stat.name} className="flex flex-row">
          <span className="capitalize font-semibold text-lg flex-1">
            {stat.name}
          </span>
          <span className="font-semibold text-lg">{stat.value}</span>
        </div>
      );
    });
  };

  return (
    <div className="w-full sm:w-1/2 md:w-1/2 xl:w-1/4 p-2">
      <div className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
        <div className="relative pb-48 overflow-hidden">
          <img
            className="absolute z-10 inset-0 h-full w-full object-contain"
            src={getSpriteUrl(pokemon.id)}
            alt=""
          />
        </div>
        <div className="p-4">
          {renderTypes()}
          <h2 className="mt-2 mb-2 font-bold capitalize text-xl">
            {pokemon.name}
          </h2>

          <div className="py-4 border-t border-b text-xs">{renderStats()}</div>

          <div className="mt-3 flex items-center justify-end">
            <span className="font-bold text-xl">{pokemon.base_experience}</span>
            &nbsp;
            <span className="text-sm font-semibold">XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export { PokemonCard };
