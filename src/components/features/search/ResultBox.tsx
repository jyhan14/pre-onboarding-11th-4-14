import React, { useEffect, useState, useRef, useImperativeHandle, useCallback } from 'react';
import { styled } from 'styled-components';
import { HiMagnifyingGlass } from "react-icons/hi2";

interface SearchResult {
  sickCd: string;
  sickNm: string;
}

interface ResultBoxProps {
  searchResults: SearchResult[];
  searchInput: string;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface ResultBoxRef {
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const ResultBox = React.forwardRef<ResultBoxRef, ResultBoxProps>((props, ref) => {
  const { searchResults, searchInput, searchInputRef } = props;
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const resultBoxRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    setIsLoading(true);

    const filterResults = async () => {
      try {
        const filteredData = searchResults.filter(
          result =>
            result.sickNm.toLowerCase().includes(searchInput.toLowerCase()) &&
            !result.sickCd.toLowerCase().includes(searchInput.toLowerCase()),
        );

        await new Promise(resolve => setTimeout(resolve, 1000));

        setFilteredResults(filteredData);
      } catch (error) {
        console.error('검색 결과 필터링 중 오류 발생:', error);
        setFilteredResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    filterResults();
  }, [searchResults, searchInput]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isLoading) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prevIndex =>
          prevIndex < filteredResults.length - 1 ? prevIndex + 1 : prevIndex,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedIndex === 0) {
          // 첫 번째 항목에서 ArrowUp을 누를 때, 입력 필드로 포커스 이동
          searchInputRef.current?.focus();
          setSelectedIndex(-1);
        } else {
          setSelectedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        }
      } else if (e.key === 'Enter' && selectedIndex !== -1 && resultBoxRef.current) {
        e.preventDefault();
        const selectedElement = resultBoxRef.current.children[selectedIndex] as HTMLElement;
        if (selectedElement) {
          selectedElement.click();
          searchInputRef.current?.blur();
        }
      }
    },
    [isLoading, filteredResults, selectedIndex, searchInputRef],
  );

  useEffect(() => {
    if (selectedIndex !== -1 && resultBoxRef.current) {
      const selectedElement = resultBoxRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.focus();
      }
    }
  }, [selectedIndex]);

  useImperativeHandle(ref, () => ({
    handleKeyDown,
  }));

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <BoxContainer ref={resultBoxRef} onKeyDown={handleKeyDown} tabIndex={0}>
      <SearchInput>{searchInput}</SearchInput>
      {!isLoading ? (
        <>
          {searchResults.length > 0 ? (
            <>
              <ResultLabel>추천 검색결과</ResultLabel>
              {filteredResults.map((result, index) => (
                <ResultItem
                  key={result.sickCd}
                  tabIndex={0}
                  className={index === selectedIndex ? 'selected' : ''}
                  onClick={() => handleItemClick(index)}>
                  <HiMagnifyingGlass/>  {result.sickNm}
                </ResultItem>
              ))}
            </>
          ) : (
            <Text>검색결과 없음</Text>
          )}
        </>
      ) : (
        <Text>검색중...</Text>
      )}
    </BoxContainer>
  );
});

export default ResultBox;

const BoxContainer = styled.div`
  position: absolute;
  top: 35px;
  right: 0px;
  padding: 15px;
  z-index: 2010;
  width: 500px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0px 2px 4px rgba(30, 32, 37, 0.1);
  box-sizing: border-box;

  &:focus {
    outline: none;
  }
`;
const SearchInput = styled.div`
  padding: 5px;
  margin-bottom: 10px;
`
const ResultLabel = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ResultItem = styled.div`
  cursor: pointer;
gap: 5px;
padding: 5px;

  &.selected {
    font-weight: bold;
    background-color: #f2f2f2;
  }

  &:hover {
    background-color: #f2f2f2;
  }
  &:focus {
    outline: none;
  }
`;

const Text = styled.div`
  font-size: 14px;
`