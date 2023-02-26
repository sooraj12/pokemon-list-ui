import { Reducer, useCallback, useReducer } from "react";
import axios from "axios";

import { storage } from "../../utils";
import {
  Pokemon,
  PokemonMessages,
  PokemonName,
  PokemonState,
} from "../../types";

const endPoint = "https://beta.pokeapi.co/graphql/v1beta";
const axiosInstance = axios.create({
  baseURL: endPoint,
  method: "POST",
});
const maxRecents = 3;
const recentsStorage = storage("recents");
const namesLimit = 10;
const cardsLimit = 25;

const reducer = (state: PokemonState, action: PokemonMessages) => {
  switch (action.type) {
    case "set_search_term":
      return {
        ...state,
        searchTerm: action.data,
      };
    case "set_names":
      return {
        ...state,
        names: [...action.data],
      };
    case "set_recent_search":
      let newRecents = [];
      if (state.recents.includes(action.data)) {
        newRecents = state.recents;
      } else {
        if (state.recents.length >= maxRecents) {
          newRecents = [action.data, ...state.recents.slice(0, 2)];
        } else {
          newRecents = [action.data, ...state.recents];
        }
      }
      // persist recent searches
      recentsStorage.setItem(newRecents);
      return {
        ...state,
        recents: newRecents,
      };
    case "set_list_loading":
      return {
        ...state,
        list: {
          ...state.list,
          isLoading: action.data,
        },
      };
    case "set_list":
      return {
        ...state,
        list: {
          ...state.list,
          data: [...action.data],
        },
      };
    case "update_list":
      return {
        ...state,
        list: {
          ...state.list,
          data: [...state.list.data, ...action.data],
        },
      };
    case "set_pIndex":
      return {
        ...state,
        list: {
          ...state.list,
          pIndex: action.data,
        },
      };
    case "set_has_more":
      return {
        ...state,
        list: {
          ...state.list,
          hasMore: action.data,
        },
      };
    default:
      return state;
  }
};

function init(initialState: PokemonState): PokemonState {
  const recents = recentsStorage.getItem();
  return {
    ...initialState,
    recents: recents ? recents.split(",") : initialState.recents,
  };
}

function usePokemonList() {
  const INITIAL_STATE: PokemonState = {
    searchTerm: "",
    // can store upto 3 recent searches
    recents: [],
    names: [],
    list: {
      data: [],
      isLoading: true,
      pIndex: 0,
      hasMore: false,
    },
  };

  const [state, setState] = useReducer<
    Reducer<PokemonState, PokemonMessages>,
    PokemonState
  >(reducer, INITIAL_STATE, init);

  //   set search term
  const sestSearchTerm = (term: string) => {
    setState({ type: "set_search_term", data: term });
  };

  // set recent search keyword
  const setRecentKeyword = (keyword: string) => {
    setState({ type: "set_recent_search", data: keyword });
  };

  // set names for auto suggest
  const setNames = (names: PokemonName[]) => {
    setState({ type: "set_names", data: names });
  };

  const setListLoading = (isLoading: boolean) => {
    setState({ type: "set_list_loading", data: isLoading });
  };

  const setList = (data: Pokemon[]) => {
    setState({ type: "set_list", data });
  };

  const updateList = (data: Pokemon[]) => {
    setState({ type: "update_list", data });
  };

  const setPindex = (index: number) => {
    setState({ type: "set_pIndex", data: index });
  };

  const setHasMore = (hasMore: boolean) => {
    setState({ type: "set_has_more", data: hasMore });
  };

  const getNamesQuery = (prefix: string) => {
    return `query fetchNames {
      pokemon_v2_pokemon(where: {name: {_regex: ${prefix}}}, limit: ${namesLimit}, offset: 0) {
        id,
        name
      }
    }`;
  };

  const fetchNames = useCallback((searchTerm: string) => {
    if (searchTerm) {
      axiosInstance({
        data: {
          query: getNamesQuery(searchTerm),
        },
      })
        .then((res) => {
          const names = res.data.data.pokemon_v2_pokemon;
          setNames(names);
        })
        .catch((err) => {});
    } else {
      setNames([]);
    }
  }, []);

  const getListQuery = (prefix: string, offset: number) => {
    if (!prefix) {
      return `query fetchList {
        pokemon_v2_pokemon(limit: ${cardsLimit}, offset: ${offset}) {
          id
          name
          pokemon_v2_pokemontypes {
            pokemon_v2_type {
              name
            }
          }
          base_experience
          pokemon_v2_pokemonstats {
            pokemon_v2_stat {
              name
            }
            base_stat
          }
        }
      }
      `;
    }

    return `query fetchList {
      pokemon_v2_pokemon(where: {name: {_regex: ${prefix}}} , limit: ${cardsLimit}, offset: ${offset}) {
        id
        name
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
        base_experience
        pokemon_v2_pokemonstats {
          pokemon_v2_stat {
            name
          }
          base_stat
        }
      }
    }
    `;
  };

  const setListParams = (list: Pokemon[]) => {
    if (list.length < cardsLimit) {
      setHasMore(false);
    } else {
      setHasMore(true);
      setPindex(state.list.pIndex + cardsLimit);
    }
  };

  const fetchList = useCallback((prefix: string) => {
    setListLoading(true);
    const query = getListQuery(prefix, 0);
    axiosInstance({
      data: {
        query: query,
      },
    })
      .then((res) => {
        const list = res.data.data.pokemon_v2_pokemon;
        setList(list);
        setListParams(list);
        setListLoading(false);
      })
      .catch((err) => {
        setListLoading(false);
      });
  }, []); // eslint-disable-line

  const updateListItems = (prefix: string, page: number) => {
    const query = getListQuery(prefix, page);
    axiosInstance({
      data: {
        query: query,
      },
    })
      .then((res) => {
        const list = res.data.data.pokemon_v2_pokemon;
        updateList(list);
        setListParams(list);
      })
      .catch((err) => {});
  };

  return {
    searchTerm: state.searchTerm,
    sestSearchTerm,
    fetchNames,
    fetchList,
    updateListItems,
    recents: state.recents,
    setRecentKeyword,
    names: state.names,
    list: state.list,
  };
}

export { usePokemonList };
