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
    setIsLoading(true); // 필터링 이전에 로딩 상태를 true로 설정

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
        setIsLoading(false); // 필터링이 완료되면 로딩 상태를 false로 설정
      }
    };

    filterResults();
  }, [searchResults, searchInput]);

  useEffect(() => {
    // filteredResults가 변경되면 isLoading을 false로 설정
    setIsLoading(false);
  }, [filteredResults]);

  return (
    <BoxContainer>
      <div>
        <div>{searchInput}</div>
      </div>

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
