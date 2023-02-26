import React, { useState } from "react";
import { useClickOutside } from "../../hooks";
import { PokemonName } from "../../types";

interface SearchSuggestionsProps {
  items: PokemonName[];
  placeholder: string;
  value: string;
  onChange: (arg: string) => void;
  getItemKey: (item: PokemonName) => PokemonName["id"];
  getItemValue: (item: PokemonName) => PokemonName["name"];
  onBlur: (arg: string) => void;
}

function SearchSuggestions({
  placeholder,
  value,
  onChange,
  items,
  getItemKey,
  getItemValue,
  onBlur,
}: SearchSuggestionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const focusRef = useClickOutside<HTMLDivElement>(() =>
    setShowSuggestions(false)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleItemSelect = (item: PokemonName) => {
    const itemValue = getItemValue(item);
    setShowSuggestions(false);
    onChange(itemValue);
    onBlur(itemValue);
  };

  return (
    <div className="relative" ref={focusRef}>
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <input
        type="text"
        className="block p-4 pl-10 w-full text-sm rounded-lg border border-gray-300 outline-none transition-all focus:border-gray-400"
        placeholder={placeholder}
        onFocus={() => {
          setShowSuggestions(true);
        }}
        value={value}
        onChange={handleInputChange}
        onBlur={() => onBlur(value)}
      />

      {showSuggestions && (
        <ul
          className="dropdown-menu absolute min-w-max
        bg-white
        text-base
        list-none
        text-left
        rounded-lg
        shadow-lg
        mt-3
        bg-clip-padding
        border-none
        w-full
        cursor-pointer z-50"
          aria-labelledby="dropdownMenuButton1"
        >
          {items.map((item) => (
            <li
              key={getItemKey(item)}
              className="dropdown-item
              text-sm
              py-2
              px-4
              font-normal
              block
              w-full
              whitespace-nowrap
              bg-transparent
              text-gray-700
              hover:bg-gray-100
              text-transform: capitalize"
              onClick={() => handleItemSelect(item)}
            >
              {getItemValue(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { SearchSuggestions };
