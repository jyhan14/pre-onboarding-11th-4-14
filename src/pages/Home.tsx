import React from 'react';
import SearchBar from '../components/features/search/SearchBar';
import { styled } from 'styled-components';

const Home = () => {
  return (
    <>
    <Text>국내 모든 임상시험 검색하고</Text>
    <Text>온라인으로 참여하기</Text>
      <SearchBar />
    </>
  );
};

export default Home;

const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: 500;
  font-size: 24px;
  padding: 5px;
`