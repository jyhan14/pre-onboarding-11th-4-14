import React, { useEffect, useState, useRef, useImperativeHandle, useCallback } from 'react';
import { styled } from 'styled-components';

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
      <div>{searchInput}</div>
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
                  검색 결과: {result.sickNm}
                </ResultItem>
              ))}
            </>
          ) : (
            <div>검색결과 없음</div>
          )}
        </>
      ) : (
        <div>검색중...</div>
      )}
    </BoxContainer>
  );
});

export default ResultBox;

const BoxContainer = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  padding: 20px;
  z-index: 2010;
  width: 550px;
  border-radius: 18px;
  background: #fff;
  box-shadow:
    0 2px 6px 0 rgb(0 0 0 / 100%),
    0 0 1px 0 rgb(0 21 81 / 5%);
  box-sizing: border-box;

  &:focus {
    outline: none;
  }
`;

const ResultLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const ResultItem = styled.div`
  cursor: pointer;

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
