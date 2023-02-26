interface RecentSearchesProps {
  items: string[];
  onSelect: (item: string) => void;
}

function RecentSearches({ items, onSelect }: RecentSearchesProps) {
  return items && items.length > 0 ? (
    <div className="pt-10 flex flex-row">
      <span className="mr-2">Recent Searches : </span>
      <ul className="flex flex-row">
        {items.map((item) => (
          <li
            key={item}
            className="mr-2 cursor-pointer px-2 py-2 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs"
            onClick={() => onSelect(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <></>
  );
}

export { RecentSearches };
