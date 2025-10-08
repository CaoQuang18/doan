import React, { useState, useEffect, createContext, useMemo, useCallback } from "react";
import { apiEndpoints } from "../services/api";
import { logApiError } from "../utils/errorLogger";
import { processHousesImages } from "../utils/imageHelper";

export const HouseContext = createContext();

const HouseContextProvider = ({ children }) => {

  const [houses, setHouses] = useState([]);
  const [allHouses, setAllHouses] = useState([]); // Lưu tất cả houses từ API
  const [country, setCountry] = useState('Location (any)');
  const [countries, setCountries] = useState([]);
  const [property, setProperty] = useState('Property type (any)');
  const [properties, setProperties] = useState([]);
  const [price, setPrice] = useState('Price range (any)');
  const [loading, setLoading] = useState(false);

  // Load houses từ API using new API service
  useEffect(() => {
    const fetchHouses = async () => {
      setLoading(true);
      try {
        console.log('🔄 Fetching houses from API...');
        const data = await apiEndpoints.houses.getAll();
        console.log('✅ Received data:', data);
        console.log('📊 Number of houses:', data?.length);
        
        // Fix image URLs to use full backend URL
        const housesWithImages = processHousesImages(data);
        console.log('🖼️ Houses with images:', housesWithImages);
        
        setHouses(housesWithImages);
        setAllHouses(housesWithImages);
      } catch (err) {
        console.error('❌ Error fetching houses:', err);
        logApiError(err, { 
          endpoint: '/houses',
          method: 'GET'
        });
        setHouses([]);
        setAllHouses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  useEffect(()=>{
    const allCountries = allHouses.map((house)=>{
      return house.country;
    });
    const uniqueCountries =['Location (any)', ...new Set(allCountries)]
    setCountries(uniqueCountries)

  }, [allHouses]);

  
  useEffect(()=>{
    const allProperties = allHouses.map((house)=>{
      return house.type;
    });
    const uniqueProperties =['Property type (any)', ...new Set(allProperties)]
    setProperties(uniqueProperties);

  }, [allHouses]);


  const handleClick = useCallback(() => {
    setLoading(true);
    const isDefault = (str) => {
      return str.split(' ').includes('(any)');
    };
    const minPrice = parseInt(price.split(' ')[0]);
    const maxPrice = parseInt(price.split(' ')[2]);
    const newHouses = allHouses.filter((house) => {
      const housePrice = parseInt(house.price);

      if (house.country === country && house.type === property && 
          housePrice >= minPrice && housePrice <= maxPrice) {
        return true;
      }

      if (isDefault(country) && isDefault(property) && isDefault(price)) {
        return true;
      }

      if (!isDefault(country) && isDefault(property) && isDefault(price)) {
        return house.country === country;
      }

      if (!isDefault(property) && isDefault(country) && isDefault(price)) {
        return house.type === property;
      }

      if (!isDefault(price) && isDefault(country) && isDefault(property)) {
        if (housePrice >= minPrice && housePrice <= maxPrice) {
          return true;
        }
      }

      if (!isDefault(country) && !isDefault(property) && isDefault(price)) {
        return house.country === country && house.type === property;
      }

      if (!isDefault(country) && isDefault(property) && !isDefault(price)) {
        if (housePrice >= minPrice && housePrice <= maxPrice) {
          return house.country === country;
        }
      }

      if (isDefault(country) && !isDefault(property) && !isDefault(price)) {
        if (housePrice >= minPrice && housePrice <= maxPrice) {
          return house.type === property;
        }
      }

      return false;
    });

    setTimeout(() => {
      if (newHouses.length < 1) {
        setHouses([]);
      } else {
        setHouses(newHouses);
      }
      setLoading(false);
    }, 1000);
  }, [allHouses, country, property, price]);

  // Advanced search handler
  const handleAdvancedSearch = useCallback((filters) => {
    setLoading(true);
    
    if (!filters) {
      // Reset to all houses
      setHouses(allHouses);
      setLoading(false);
      return;
    }

    const filtered = allHouses.filter((house) => {
      const housePrice = parseInt(house.price);
      const houseBedrooms = parseInt(house.bedrooms);
      const houseBathrooms = parseInt(house.bathrooms);
      const houseSurface = parseInt(house.surface);

      // Country filter
      if (filters.countries.length > 0 && !filters.countries.includes(house.country)) {
        return false;
      }

      // Property type filter
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(house.type)) {
        return false;
      }

      // Price range filter
      if (housePrice < filters.priceRange[0] || housePrice > filters.priceRange[1]) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms) {
        if (filters.bedrooms === '6+') {
          if (houseBedrooms < 6) return false;
        } else if (houseBedrooms !== parseInt(filters.bedrooms)) {
          return false;
        }
      }

      // Bathrooms filter
      if (filters.bathrooms) {
        if (filters.bathrooms === '4+') {
          if (houseBathrooms < 4) return false;
        } else if (houseBathrooms !== parseInt(filters.bathrooms)) {
          return false;
        }
      }

      // Min surface filter
      if (filters.minSurface && houseSurface < parseInt(filters.minSurface)) {
        return false;
      }

      return true;
    });

    setTimeout(() => {
      setHouses(filtered);
      setLoading(false);
    }, 500);
  }, [allHouses]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    country,
    setCountry,
    countries,
    property,
    setProperty,
    properties,
    price,
    setPrice,
    houses,
    loading,
    handleClick,
    handleAdvancedSearch,
  }), [country, countries, property, properties, price, houses, loading, handleClick, handleAdvancedSearch]);

  return (
    <HouseContext.Provider value={contextValue}>
      {children}
    </HouseContext.Provider>
  );
};

export default HouseContextProvider;
