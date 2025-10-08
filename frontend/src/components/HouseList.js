// src/components/HouseList.js
import React, { useContext, memo, useState, useMemo } from 'react';
import { HouseContext } from './HouseContext';
import House from './House';
import { Link } from 'react-router-dom';
import { SkeletonGrid } from './SkeletonLoading';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

const ITEMS_PER_PAGE = 9;

const HouseList = memo(() => {
  const { houses, loading } = useContext(HouseContext);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(houses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentHouses = useMemo(() => houses.slice(startIndex, endIndex), [houses, startIndex, endIndex]);

  // Reset to page 1 when houses change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [houses.length]);

  if (loading) {
    return (
      <section className="mb-20">
        <div className="container mx-auto">
          <SkeletonGrid count={6} />
        </div>
      </section>
    );
  }

  if (houses.length < 1) {
    return (
      <section className="mb-20">
        <div className="container mx-auto">
          <EmptyState
            type="search"
            title="No properties found"
            message="We couldn't find any properties matching your criteria"
            suggestions={[
              'Try adjusting your price range',
              'Select different locations',
              'Remove some filters',
              'Browse all available properties'
            ]}
            actions={[
              {
                label: 'Reset Filters',
                primary: true,
                onClick: () => window.location.reload()
              },
              {
                label: 'Browse All',
                primary: false,
                onClick: () => window.location.href = '/'
              }
            ]}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="mb-20 pt-4">
      <div className="container mx-auto px-4">
        {/* House Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {currentHouses.map((house, index) => (
            <Link to={`/property/${house._id}`} key={house._id || index}>
              <House house={house} />
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={houses.length}
          />
        )}
      </div>
    </section>
  );
});

HouseList.displayName = 'HouseList';

export default HouseList;
