import React, { useContext } from 'react';
import { RiWallet3Line, RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { Menu } from '@headlessui/react';
import { HouseContext } from './HouseContext';

const PriceRangeDropdown = () => {
  const { price, setPrice } = useContext(HouseContext);

  const prices = [
    { value: 'Price range (any)' },
    { value: '100000 - 130000' },
    { value: '130000 - 160000' },
    { value: '160000 - 190000' },
    { value: '190000 - 220000' },
    { value: '100000 - 300000' },
    { value: '30000 - 40000' },
  ];
  
  return (
    <Menu as="div" className="relative w-full">
      {({ open }) => (
        <>
          {/* Nút dropdown */}
          <Menu.Button 
            className="flex items-center justify-between w-full px-4 py-3 bg-violet-600 dark:bg-violet-700 text-white rounded-lg shadow-md hover:bg-violet-700 dark:hover:bg-violet-800 transition">
            <div className="flex items-center gap-2">
              <RiWallet3Line className="text-xl text-violet-200" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">{price}</span>
                <span className="text-xs text-violet-200">Choose price range</span>
              </div>
            </div>
            {open ? (
              <RiArrowUpSLine className="text-xl" />
            ) : (
              <RiArrowDownSLine className="text-xl" />
            )}
          </Menu.Button>

          {/* Menu dropdown - Absolute position */}
          <Menu.Items
            className="absolute mt-2 w-full bg-white dark:bg-gray-700 rounded-lg shadow-2xl dark:shadow-xl border border-gray-100 dark:border-gray-600 max-h-60 overflow-y-auto"
            style={{ zIndex: 99999 }}
          >
            {prices.map((p, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <div
                    onClick={() => setPrice(p.value)}
                    className={`px-4 py-2 cursor-pointer transition 
                    ${active ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {p.value}
                  </div>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </>
      )}
    </Menu>
  );
};

export default PriceRangeDropdown;
