import React, { useState, useRef, useEffect, useCallback } from 'react';
import { styled } from 'styled-components';
import { getSicks } from '../../../api/sick';
import ResultBox, { ResultBoxRef } from './ResultBox';
import { useDebounce } from '../../../hooks/useDebounce';
import { HiMagnifyingGlass } from 'react-icons/hi2';

export interface SearchResult {
  sickCd: string;
  sickNm: string;
}

const SearchBar = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResultBox, setShowResultBox] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const resultBoxRef = useRef<ResultBoxRef | null>(null);

  // 비동기 함수로 검색 결과를 가져오고 캐시에 저장하는 함수
  const fetchSearchResults = async (value: string) => {
    const cacheName = 'searchResultsCache';
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(value);

    if (cachedResponse) {
      const dataWithExpiration = await cachedResponse.json();
      const { value: data, expiration } = dataWithExpiration;

      if (Date.now() < expiration) {
        // 만료되지 않았으면 캐시된 데이터를 사용
        setSearchResults(data);
        return; // 만료되지 않았으면 함수 종료
      } else {
        // 만료된 데이터이므로 캐시에서 제거
        await cache.delete(value); // 캐시에서 해당 데이터를 삭제
      }
    }

    // 서버에서 새로운 데이터를 가져와서 캐시에 저장
    const cacheExpireTime = 5 * 60 * 1000; // 테스트를 위해 5분(5 * 60초) 설정
    try {
      const data = await getSicks(value);
      setSearchResults(data);
      const expiration = Date.now() + cacheExpireTime;
      const dataWithExpiration = {
        value: data,
        expiration,
      };
      const response = new Response(JSON.stringify(dataWithExpiration), {
        headers: { 'Cache-Control': `max-age=${cacheExpireTime / 1000}` },
      });
      cache.put(value, response); // 캐시에 결과를 저장
    } catch (error) {
      console.error('Error while fetching search results:', error);
      setSearchResults([]); // 검색 결과를 초기화하여 보여주지 않음
    }
  };

  const handleOnChangeInput = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      setSearchResults([]);
      setShowResultBox(false); // 입력이 비어있을 때 결과 박스 숨기기
    } else {
      fetchSearchResults(value);
      setShowResultBox(true); // 입력 값이 있을 때만 결과 박스 보이기
    }
  }, 1000);

  const handleSearch = () => {
    const value = searchInputRef.current?.value.trim() || '';
    if (value !== '') {
      fetchSearchResults(value);
      setShowResultBox(true);
    }
  };

  const handleSearchAction = () => {
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
      if (resultBoxRef.current) {
        resultBoxRef.current.handleKeyDown(e);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e: MouseEvent) => {
    const searchInput = document.querySelector('[data-testid="search-input"]');

    // 클릭 타겟이 SearchInput 요소가 아닌 경우 결과 박스 숨기기
    if (searchInput && !searchInput.contains(e.target as Node) && e.target !== searchInput) {
      setShowResultBox(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleFormSubmit}>
        <SearchContainer>
          <MagnifyingGlass />
          <SearchInput
            type='text'
            ref={searchInputRef}
            onChange={handleOnChangeInput}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchAction();
              } else {
                handleKeyDown(e);
              }
            }}
            onFocus={handleFocus}
            data-testid='search-input'
          />
          <SearchBtn type='submit'>검색</SearchBtn>
        </SearchContainer>
      </form>
      {(showResultBox || searchResults.length > 0) && (
        <div style={{ position: 'relative' }}>
          <ResultBox
            ref={resultBoxRef}
            searchResults={searchResults}
            searchInput={searchInputRef.current?.value || ''}
            searchInputRef={searchInputRef}
          />
        </div>
      )}
    </Container>
  );
};

export default SearchBar;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const MagnifyingGlass = styled(HiMagnifyingGlass)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
`;

const SearchInput = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  padding-left: 40px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  margin-top: 20px;
  box-shadow: 0px 2px 4px rgba(30, 32, 37, 0.1);
  cursor: pointer;
  border-radius: 42px;
  background-color: #ffffff;

  &:focus {
    outline: none;
  }
`;

const SearchBtn = styled.button`
  cursor: pointer;

  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background-color: #0081cf;
  border-top-right-radius: 42px;
  border-bottom-right-radius: 42px;
  padding: 10px 20px;
  margin-left: -1px;

  color: white;
  text-align: center;
`;
