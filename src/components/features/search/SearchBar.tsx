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

  const handleOnChangeInput = useDebounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value === '') {
      setSearchResults([]);
    } else {
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
    }
  }, 1000);

  const handleSearch = () => {
    const value = searchInputRef.current?.value.trim() || '';
    if (value !== '') {
      caches.open('searchResultsCache').then(cache => {
        cache.match(value).then(cachedResponse => {
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
        });
      });
      setRecentSearchWords([value, ...recentSearchWords.filter(word => word !== value)]);
    }

    // resultbox를 항상 보이도록 설정
    setShowResultBox(true);
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

  // 외부 클릭 시 검색 결과 숨기는 함수
  const handleOutsideClick = (e: MouseEvent) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(e.target as Node) &&
      e.target !== searchInputRef.current
    ) {
      setSearchResults([]); // 검색 결과 숨기기
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
      <form onSubmit={handleFormSubmit}>
        <SearchInput
          type='text'
          ref={searchInputRef}
          onChange={handleOnChangeInput}
          onClick={() => setShowResultBox(true)} // 검색 버튼 또는 엔터를 눌렀을 때 resultbox가 나타나도록 수정
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          onFocus={() => setShowResultBox(true)}
          onBlur={() => setShowResultBox(false)}
          data-testid='search-input'
        />
        <button onClick={handleSearchClick}>검색</button>
      </form>
      {showResultBox && (
        <div style={{ position: 'relative' }}>
          <ResultBox
            searchResults={searchResults}
            searchInput={searchInputRef.current?.value || ''}
            recentSearchWords={recentSearchWords}
            setSearchResults={setSearchResults}
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
