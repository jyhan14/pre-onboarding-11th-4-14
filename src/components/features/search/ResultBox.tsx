import React from 'react';
import { styled } from 'styled-components';

const ResultBox = () => {
  return (
    <BoxContainer>
      <div>테스트입니다</div>
      <div>테스트입니다</div>
      <div>테스트입니다</div>
      <div>테스트입니다</div>
      <div>테스트입니다</div>
      <div>테스트입니다</div>

      <button onClick={() => console.log('test')} data-testid='test-button'>
        테스트
      </button>
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
