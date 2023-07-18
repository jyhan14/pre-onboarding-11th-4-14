import React, { useState, useRef, useEffect } from 'react';
import { styled } from 'styled-components';
import { getSicks } from '../../../api/sick';
import ResultBox from './ResultBox';
import { useDebounce } from '../../../hooks/useDebounce';
import useSessionStorage from '../../../hooks/useSessionStorage';

interface SearchResult {
  sickCd: string;
  sickNm: string;
}

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearchWords, setRecentSearchWords] = useSessionStorage<string[]>(
    'recent_search_words',
    [],
  );
  const [showResultBox, setShowResultBox] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // 컴포넌트 마운트 시 세션 스토리지에서 최근 검색어 로드
  useEffect(() => {
    const savedRecentSearchWords = sessionStorage.getItem('recent_search_words');
    if (savedRecentSearchWords) {
      setRecentSearchWords(JSON.parse(savedRecentSearchWords));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('recent_search_words', JSON.stringify(recentSearchWords));
  }, [recentSearchWords]);

  const handleOnChangeInput = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      setSearchResults([]);
    } else {
      getSicks(value)
        .then(data => {
          setSearchResults(data);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
        });
    }
  }, 1000);

  const handleSearch = () => {
    const value = searchInputRef.current?.value.trim() || '';
    if (value !== '') {
      getSicks(value)
        .then(data => {
          setSearchResults(data);
          setRecentSearchWords([value, ...recentSearchWords.filter(word => word !== value)]);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setSearchResults([]);
        });
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(e.target as Node) &&
      e.target !== searchInputRef.current
    ) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    // 컴포넌트가 언마운트되면 이벤트 리스너 제거
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <SearchContainer>
      <SearchInput
        type='text'
        ref={searchInputRef}
        onChange={handleOnChangeInput}
        onClick={() => setSearchResults([])}
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        onFocus={() => setShowResultBox(true)} // input 필드가 포커스 될 때 ResultBox 보이기
        onBlur={() => setShowResultBox(false)} //  input 필드에서 포커스가 사라질 때 ResultBox 숨기기
        data-testid='search-input'
      />
      <button onClick={() => handleSearch}>검색</button>
      {showResultBox && ( //showResultBox 상태에 따라 ResultBox 표시
        <div style={{ position: 'relative' }}>
          <ResultBox
            searchResults={searchResults}
            searchInput={searchInputRef.current?.value || ''}
            recentSearchWords={recentSearchWords}
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
