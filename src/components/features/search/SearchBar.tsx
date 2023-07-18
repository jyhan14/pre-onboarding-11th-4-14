import React, { useEffect, useState, useRef } from 'react';
import { styled } from 'styled-components';
import { getSicks } from '../../../api/sick';
import ResultBox from './ResultBox';
import { useDebounce } from '../../../hooks/useDebounce';

const SearchBar = () => {
  const [isSearchStart, setIsSearchStart] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearchStarted, setHasSearchStarted] = useState(false); 
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [recentSearchWords, setRecentSearchWords] = useState<string[]>([]);

   // 컴포넌트 마운트 시 세션 스토리지에서 최근 검색어 로드
  useEffect(() => {
    const savedRecentSearchWords = sessionStorage.getItem('recent_search_words');
    if (savedRecentSearchWords) {
      setRecentSearchWords(JSON.parse(savedRecentSearchWords));
    }
  }, []);

  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
   // ref를 사용하기 때문에 검색 입력에 대한 상태 사용이 불필요
    debounce(e);
  };

  const debounce = useDebounce((e: React.ChangeEvent<HTMLInputElement>) => {
    // useRef를 사용하여 검색 입력의 현재 값을 가져온다
    const value = e.target.value.trim();
    if (value === '') {
      setSearchResults([]); // searchInput이 비어 있는 경우 검색 결과 지우기
      setHasSearchStarted(false); // searchInput이 비어 있는 경우 검색 상태 재설정
    } else {
      setHasSearchStarted(true); //검색 프로세스 시작
      getSicks(value)
        .then(data => {
          setSearchResults(data);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        });

     // 최근 검색어 목록에 검색어 추가
      setRecentSearchWords(prevWords => [value, ...prevWords]); // Use array instead of Set
    }
  }, 1000);

// 최근 검색어가 변경될 때마다 세션 스토리지에 저장
  useEffect(() => {
    sessionStorage.setItem('recent_search_words', JSON.stringify(recentSearchWords));
  }, [recentSearchWords]);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

     // 컴포넌트가 언마운트되면 이벤트 리스너 제거
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e: MouseEvent) => {
   // searchInputRef를 사용하여 클릭된 요소가 SearchInput 요소가 아닌지 확인
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(e.target as Node) &&
      e.target !== searchInputRef.current
    ) {
      setIsSearchStart(false);
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        type='text'
        ref={searchInputRef} // ref를 입력 요소에 할당
        onChange={handleOnChangeInput}
        onClick={() => setIsSearchStart(true)}
        data-testid='search-input'
      />
      <button>검색</button>
      {isSearchStart && hasSearchStarted && (
        <div style={{ position: 'relative' }}>
          {/* searchResults, searchInput 및 recentSearchWords를 속성으로 전달 */}
          <ResultBox
            searchResults={searchResults}
            searchInput={searchInputRef.current?.value || ''}
            recentSearchWords={recentSearchWords} // 최근 검색어를 추가합니다.
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
