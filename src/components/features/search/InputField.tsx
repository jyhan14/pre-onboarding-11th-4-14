import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { getSicks } from '../../../api/sick';
import ResultBox from './ResultBox';

const Search = () => {
  const [isSearchStart, setIsSearchStart] = useState(false);

  useEffect(() => {
    getSicks();
    document.addEventListener('click', handleOutsideClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e: MouseEvent) => {
    const searchInput = document.querySelector('[data-testid="search-input"]');

    // Check if the click target is not the SearchInput element
    if (searchInput && !searchInput.contains(e.target as Node) && e.target !== searchInput) {
      setIsSearchStart(false);
    }
  };

  return (
    <SearchContainer>
      <SearchInput type='text' onClick={() => setIsSearchStart(true)} data-testid='search-input' />
      <button>검색</button>
      {isSearchStart && (
        <div style={{ position: 'relative' }}>
          <ResultBox />
        </div>
      )}
    </SearchContainer>
  );
};

export default Search;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchInput = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  box-shadow: 0px 2px 4px rgba(30, 32, 37, 0.1);
  cursor: pointer;
  border-radius: 42px;
  border: 1;
  border-color: black;
  background-color: #ffffff;
`;
