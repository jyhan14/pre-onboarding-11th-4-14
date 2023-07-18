// ResultBox.tsx

import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';

interface SearchResult {
  sickCd: string;
  sickNm: string;
}

interface ResultBoxProps {
  searchResults: SearchResult[];
  searchInput: string;
  recentSearchWords: string[];
}

const ResultBox: React.FC<ResultBoxProps> = ({ searchResults, searchInput, recentSearchWords }) => {
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    filterResults();
  }, [searchResults, searchInput]);

  useEffect(() => {
    setIsLoading(false);
  }, [filteredResults]);

  return (
    <BoxContainer>
      <div>
        <div>{searchInput}</div>
      </div>

      {/* 최근 검색어 표시 */}
      {recentSearchWords.length > 0 && (
        <>
          <RecentSearchLabel>최근 검색어</RecentSearchLabel>
          <RecentSearchList>
            {recentSearchWords.map(word => (
              <RecentSearchItem key={word}>{word}</RecentSearchItem>
            ))}
          </RecentSearchList>
        </>
      )}

      {isLoading ? (
        <div>검색중...</div>
      ) : (
        <>
          {filteredResults.length > 0 ? (
            <>
              <ResultLabel>추천 검색결과</ResultLabel>
              {filteredResults.map(result => (
                <div key={result.sickCd}>검색 결과: {result.sickNm}</div>
              ))}
            </>
          ) : (
            <div>검색결과 없음</div>
          )}
        </>
      )}
    </BoxContainer>
  );
};

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
`;

const ResultLabel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const RecentSearchLabel = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const RecentSearchList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const RecentSearchItem = styled.div`
  margin-right: 8px;
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f2f2f2;
  font-size: 14px;
  cursor: pointer;
`;
