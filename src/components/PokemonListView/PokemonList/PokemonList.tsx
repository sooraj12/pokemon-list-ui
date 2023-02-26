import { useEffect } from "react";
// import { FixedSizeGrid as Grid } from "react-window";
// import AutoSizer from "react-virtualized-auto-sizer";
// import InfiniteLoader from "react-window-infinite-loader";
import InfiniteScroll from "react-infinite-scroller";

import { PokemonCard } from "../PokemonCard";
import { usePokemonListProvider } from "../../../hooks";
import { ListSkeleton } from "../../Skeleton";

// const noOfColumns = 4;
// const cardHeight = 510;

function PokemonList() {
  const { searchTerm, fetchList, updateListItems, list } =
    usePokemonListProvider();

  // const rowCount = Math.ceil(list.data.length / noOfColumns);

  useEffect(() => {
    fetchList(searchTerm);
  }, [searchTerm, fetchList]);

  const loadMore = () => {
    updateListItems(searchTerm, list.pIndex);
  };

  const renderList = () => {
    return (
      <div className="flex flex-wrap">
        {list.data.map((pokemon) => {
          return <PokemonCard pokemon={pokemon} />;
        })}
      </div>
    );
  };

  if (list.isLoading) {
    return (
      <div className="pt-10">
        <div className="flex flex-wrap pb-40">
          <ListSkeleton count={4} />
        </div>
      </div>
    );
  }

  if (list.data.length === 0) {
    return (
      <div className="text-center mt-56 text-xl">
        There are no pokimons with this name
      </div>
    );
  }

  return (
    <div className="mt-5 h-full overflow-auto">
      <InfiniteScroll
        hasMore={list.hasMore}
        loader={<div key={0}>Loading...</div>}
        initialLoad={false}
        threshold={1000}
        useWindow={false}
        loadMore={loadMore}
        className="h-full"
      >
        {renderList()}
      </InfiniteScroll>
      {/* <InfiniteLoader
        className=""
        isItemLoaded={true}
        loadMoreItems={loadMore}
        itemCount={list.data.length + 100}
        threshold={1000}
      >
        {({ ref }) => {
          return (
            <AutoSizer ref={ref}>
              {({ height, width }) => {
                return (
                  <Grid
                    columnCount={noOfColumns}
                    columnWidth={width / noOfColumns}
                    height={height}
                    width={width}
                    rowCount={rowCount}
                    rowHeight={cardHeight}
                    className="flex flex-wrap"
                    itemData={list.data}
                  >
                    {({ columnIndex, rowIndex, style, data }) => {
                      const pokemon =
                        data[rowIndex * noOfColumns + columnIndex];
                      if (!pokemon) return;
                      return <PokemonCard style={style} pokemon={pokemon} />;
                    }}
                  </Grid>
                );
              }}
            </AutoSizer>
          );
        }}
      </InfiniteLoader> */}
    </div>
  );
}

export { PokemonList };
