import React, { useContext } from 'react';
import CountryDropdown from './CountryDropdown';
import PropertyDropdown from './PropertyDropdown';
import PriceRangeDropdown from './PriceRangeDropdown';
import { RiSearch2Line } from "react-icons/ri";
import { HouseContext } from './HouseContext';

const Search = () => {
  const { handleClick } = useContext(HouseContext);

  return (
    <div className="px-4 lg:px-8 max-w-[1170px] mx-auto relative pb-4">
      <div
        className="px-6 py-6 flex flex-col lg:flex-row justify-between items-stretch gap-4 lg:gap-x-4 
        lg:shadow-2xl rounded-2xl 
        bg-white dark:bg-gray-800 lg:bg-white/90 lg:dark:bg-gray-800/95 lg:backdrop-blur-lg border border-white/30 dark:border-gray-700
        hover:shadow-3xl dark:shadow-gray-900/50
        relative z-50"
      >
        <CountryDropdown />
        <PropertyDropdown />
        <PriceRangeDropdown />

        <button
          onClick={handleClick}
          className="bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 
                     w-full lg:w-auto lg:min-w-[162px] h-16 rounded-xl 
                     flex justify-center items-center text-white text-lg font-semibold
                     shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
                     group"
        >
          <RiSearch2Line className="text-2xl group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default Search;
