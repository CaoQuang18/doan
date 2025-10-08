import React from 'react';
import Banner from '../components/Banner';
import HouseList from '../components/HouseList';

const Home = () => {
  return( 
  <div className='min-h-[1800px] pt-20'>
    <Banner />
    <HouseList />
  </div>
  );
};

export default Home;
