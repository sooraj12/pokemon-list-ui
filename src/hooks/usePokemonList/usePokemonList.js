import { useCallback, useReducer } from "react";
import axios from "axios";

import { storage } from "../../utils";

const endPoint = "https://beta.pokeapi.co/graphql/v1beta";
const axiosInstance = axios.create({
  baseURL: endPoint,
  method: "POST",
});
const maxRecents = 3;
const recentsStorage = storage("recents");
const namesLimit = 10;
const cardsLimit = 25;

const ACTIONS = {
  set_search_term: "set_search_term",
  set_recent_search: "set_recent_search",
  set_names: "set_names",

  // list actions
  set_list_loading: "set_list_loading",
  set_list: "set_list",
  update_list: "update_list",
  set_pIndex: "set_pIndex",
  set_has_more: "set_has_more",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.set_search_term:
      return {
        ...state,
        searchTerm: action.data,
      };
    case ACTIONS.set_names:
      return {
        ...state,
        names: [...action.data],
      };
    case ACTIONS.set_recent_search:
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
    case ACTIONS.set_list_loading:
      return {
        ...state,
        list: {
          ...state.list,
          isLoading: action.data,
        },
      };
    case ACTIONS.set_list:
      return {
        ...state,
        list: {
          ...state.list,
          data: [...action.data],
        },
      };
    case ACTIONS.update_list:
      return {
        ...state,
        list: {
          ...state.list,
          data: [...state.list.data, ...action.data],
        },
      };
    case ACTIONS.set_pIndex:
      return {
        ...state,
        list: {
          ...state.list,
          pIndex: action.data,
        },
      };
    case ACTIONS.set_has_more:
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

function init(initialState) {
  const recents = recentsStorage.getItem();
  return {
    ...initialState,
    recents: recents ? recents.split(",") : initialState.recents,
  };
}

function usePokemonList() {
  const INITIAL_STATE = {
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

  const [state, setState] = useReducer(reducer, INITIAL_STATE, init);

  //   set search term
  const sestSearchTerm = (term) => {
    setState({ type: ACTIONS.set_search_term, data: term });
  };

  // set recent search keyword
  const setRecentKeyword = (keyword) => {
    setState({ type: ACTIONS.set_recent_search, data: keyword });
  };

  // set names for auto suggest
  const setNames = (names) => {
    setState({ type: ACTIONS.set_names, data: names });
  };

  const setListLoading = (isLoading) => {
    setState({ type: ACTIONS.set_list_loading, data: isLoading });
  };

  const setList = (data) => {
    setState({ type: ACTIONS.set_list, data });
  };

  const updateList = (data) => {
    setState({ type: ACTIONS.update_list, data });
  };

  const setPindex = (index) => {
    setState({ type: ACTIONS.set_pIndex, data: index });
  };

  const setHasMore = (hasMore) => {
    setState({ type: ACTIONS.set_has_more, data: hasMore });
  };

  const getNamesQuery = (prefix) => {
    return `query fetchNames {
      pokemon_v2_pokemon(where: {name: {_regex: ${prefix}}}, limit: ${namesLimit}, offset: 0) {
        id,
        name
      }
    }`;
  };

  const fetchNames = useCallback((searchTerm) => {
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

  const getListQuery = (prefix, offset) => {
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

  const setListParams = (list) => {
    if (list.length < cardsLimit) {
      setHasMore(false);
    } else {
      setHasMore(true);
      setPindex(state.list.pIndex + cardsLimit);
    }
  };

  const fetchList = useCallback((prefix) => {
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

  const updateListItems = (prefix, page) => {
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
