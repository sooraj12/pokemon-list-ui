import React from "react";

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: string;
    };
  }[];
  pokemon_v2_pokemonstats: {
    base_stat: number;
    pokemon_v2_stat: {
      name: string;
    };
  }[];
}

export interface PokemonList {
  data: Pokemon[];
  isLoading: boolean;
  pIndex: number;
  hasMore: boolean;
}

export interface PokemonName {
  id: number;
  name: string;
}

export interface PokemonState {
  searchTerm: string;
  recents: string[];
  names: PokemonName[];
  list: PokemonList;
}

export interface PokemonStateHelpers {
  sestSearchTerm: (term: string) => void;
  setRecentKeyword: (keyword: string) => void;
}

export interface PokemonHelpers {
  fetchNames: (searchTerm: string) => void;
  fetchList: (term: string) => void;
  updateListItems: (term: string, index: number) => void;
}

export type PokemonProps = PokemonState & PokemonHelpers & PokemonStateHelpers;

export type PokemonContextType = PokemonProps;

export interface PokemonContextConfigType {
  children: React.ReactNode;
}

export type PokemonMessages =
  | { type: "set_search_term"; data: string }
  | { type: "set_names"; data: PokemonName[] }
  | { type: "set_recent_search"; data: string }
  | { type: "set_list_loading"; data: boolean }
  | { type: "set_list"; data: Pokemon[] }
  | { type: "update_list"; data: Pokemon[] }
  | { type: "set_pIndex"; data: number }
  | { type: "set_has_more"; data: boolean };
