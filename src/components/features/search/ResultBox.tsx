import React, { useEffect, useState } from 'react';
import { styled } from 'styled-components';

interface SearchResult {
  sickCd: string;
  sickNm: string;
}

interface ResultBoxProps {
  searchResults: SearchResult[];
  searchInput: string;
}

const ResultBox: React.FC<ResultBoxProps> = ({ searchResults, searchInput }) => {
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const filterResults = async () => {
      try {
        const filteredData = searchResults.filter(
          result =>
            result.sickNm.toLowerCase().includes(searchInput.toLowerCase()) &&
            !result.sickCd.toLowerCase().includes(searchInput.toLowerCase())
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

  return (
    <BoxContainer>
      <div>{searchInput}</div>
      {!isLoading ? (
        <>
          {searchResults.length > 0 ? (
            <>
              <ResultLabel>추천 검색결과</ResultLabel>
              {filteredResults.map(result => (
                <div key={result.sickCd}>검색 결과: {result.sickNm}</div>
              ))}
            </>
          ) : (
            <div>검색결과 없음</div> //검색 결과가 비어있을 때 "검색결과 없음" 표시
          )}
        </>
      ) : (
        <div>검색중...</div> // 로딩 중일 때 "검색중..." 표시
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
