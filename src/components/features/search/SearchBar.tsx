import React, { useState, useRef } from 'react';
import { styled } from 'styled-components';
import { getSicks } from '../../../api/sick';
import ResultBox from './ResultBox';
import { useDebounce } from '../../../hooks/useDebounce';

interface SearchResult {
  sickCd: string;
  sickNm: string;
}

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResultBox, setShowResultBox] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // 비동기 함수로 검색 결과를 가져오고 캐시에 저장하는 함수
  const fetchSearchResults = async (
    value: string,
    setSearchResults: React.Dispatch<React.SetStateAction<SearchResult[]>>,
  ) => {
    const cache = await caches.open('searchResultsCache');
    const cachedResponse = await cache.match(value);

    if (cachedResponse) {
      cachedResponse.json().then(data => {
        setSearchResults(data); // 캐시에서 검색 결과 가져오기
      });
    } else {
      // 캐시에 데이터가 없는 경우 API 호출을 통해 검색 결과 가져오기
      getSicks(value)
        .then(data => {
          setSearchResults(data);
          cache.put(value, new Response(JSON.stringify(data))); // 추천 검색 결과를 캐시에 저장
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setSearchResults([]); // 에러 발생 시 검색 결과 초기화
        });
    }
  };

  const handleOnChangeInput = useDebounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      setSearchResults([]);
      setShowResultBox(false); // Hide the result box when the input is empty
    } else {
      fetchSearchResults(value, setSearchResults);
      setShowResultBox(true); // Show the result box only when there is a non-empty value
    }
  }, 1000);

  const handleSearch = () => {
    const value = searchInputRef.current?.value.trim() || '';
    if (value !== '') {
      fetchSearchResults(value, setSearchResults);
      setShowResultBox(true);
    }
  };

  // 검색 버튼 클릭 시 실행되는 함수
  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault(); // 버튼 클릭 기본 동작 막기
    handleSearch();
  };

  // 폼 제출 시 실행되는 함수
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 기본 동작 막기
    handleSearch();
  };

  const handleFocus = () => {
    if (searchInputRef.current?.value) {
      setShowResultBox(true);
    }
  };

  return (
    <SearchContainer>
      <form onSubmit={handleFormSubmit}>
        <SearchInput
          type='text'
          ref={searchInputRef}
          onChange={handleOnChangeInput}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          onFocus={handleFocus}
          data-testid='search-input'
        />
        <button onClick={handleSearchClick}>검색</button>
      </form>
      {(showResultBox || searchResults.length > 0) && (
        <div style={{ position: 'relative' }}>
          <ResultBox
            searchResults={searchResults}
            searchInput={searchInputRef.current?.value || ''}
          />
        </div>
      )}
    </SearchContainer>
  );
};

export default SearchBar;

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
