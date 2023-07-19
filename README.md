# 원티드 프리온보딩 인터쉽 11차 4주차 과제

<br />

![image](https://github.com/wanted-pre-onboarding-11th-14team/pre-onboarding-11th-3-14/assets/109052469/1c8eccee-5a37-46df-b810-d22fd375f4ba)


## ABOUT

<div>
  <div style="text-align: right"> 2023.07.16 ~ 2023.07.19 </div>
    <p> 질환명 검색시 API 호출을 통해서 검색어 추천 기능을 구현하는 프로젝트입니다. </p>
    <div align="center"><a href="https://pre-onboarding-11th-4-14-basf9e2yq-jyhan14.vercel.app/"><strong>👉 배포 링크</strong></a> </div>

   ### 요구사항
   - 검색어가 없을 시 "검색어 없음" 표출
   - API 호출별로 로컬 캐싱 구현 (React-Query 등 라이브러리 사용 금지)
   - 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행
   - API를 호출할 때 마다 console.info("calling api") 출력을 통해 콘솔창에서 API 호출 횟수 확인이 가능하도록 설정
   - 키보드만으로 추천 검색어들로 이동 가능하도록 구현 <br/>

</div>

<br />

## 기술 스택

- Development

<div align="center"> 
<img alt="react" src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img alt="typescript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
<img alt="axios" src ="https://img.shields.io/badge/axios-black.svg?&style=for-the-badge&logo=axios&logoColor=white"/>
<img alt="styled-component" src="https://img.shields.io/badge/styledComponents-DB7093?style=for-the-badge&logo=styledComponents&logoColor=white">
</div>
 
 - Deploy
<div align="center"> 
<img alt="axios" src ="https://img.shields.io/badge/vercel-black.svg?&style=for-the-badge&logo=vercel&logoColor=white"/>
  </div>

## 폴더 구조

```
📦src
 ┣ 📂api
 ┣ 📂assets
 ┣ 📂components
 ┣ 📂hooks
 ┣ 📂pages
 ┣ 📂styles
 ┣ 📜App.tsx
 ┣ 📜index.tsx
 ┗ 📜react-app-env.d.ts
```

## 실행 방법
#### 서버
- assignment-api clone 하기
```
git clone https://github.com/walking-sunset/assignment-api.git
```
- 의존성 설치 및 서버 실행
```bash
npm install
# and
npm start
```

#### 클라이언트

- 의존성 설치

```bash
npm install
```

- .env 생성

```bash
  REACT_APP_SERVER_URL = http://localhost:4000
```

- 시작

```bash
npm start
```


## 서비스 소개
### API 호출별로 로컬 캐싱 구현
#### 캐싱 방법별 특징
1. SessionStorage
    * 문자열만 저장 가능
    * 5MB 용량
    * 동기적 작동
    * 새로고침 하는경우 사라짐
    * 도메인별 브라우저(탭포함) 별로 관리
2.  LocalStorage
    * 문자열만 저장 가능
    * 5MB 용량
    * 동기적 작동
    * 새로고침 하여도 사라지지 않음
    * 도메인별로 관리
3. CacheStorage
    * 비동기방식으로 메인스레드 연산 중단되지 않음
    * 다양한 데이터 저장
#### 캐싱 필요 기능과 캐싱 방법 선정
* 추천검색어 기능 : <b>CacheStorage</b> <br/>
💡사용자가 동일한 검색어로 반복적인 검색을 할 때 발생하는 불필요한 서버 요청을 최소화하기 위해 캐싱을 구현.<br/> 💡검색 결과는 5분 동안 캐시에 저장되며, 만료되면 서버에서 새로운 데이터를 가져와 캐시를 갱신
    * 캐싱 방법 선정시 고려된 사항
        * 사용자의 입력중 디바운스 되어 서버와 통신하여 응답 받은 데이터이다
        * json 형태로 문자열만 저장가능한 SessionStorage, LocalStorage에 저장하기에 적당하지 않다
        * CacheStorage는 브라우저 캐시 용량을 공유함. 캐싱하려는 데이터의 크기가 클 경우에는 CacheStorage를 사용하는 것이 더 적합하다.
* 구현 코드
    ```javaScript
     // 비동기 함수로 검색 결과를 가져오고 캐시에 저장하는 함수
    const fetchSearchResults = async (value: string) => {
        const cacheName = 'searchResultsCache'; // 캐시 이름을 정의
        const cache = await caches.open(cacheName); // 캐시를 열고 반환
        const cachedResponse = await cache.match(value); // 캐시에서 검색어에 해당하는 데이터 조회

        if (cachedResponse) {
            // 캐시된 데이터가 있으면 실행
            const dataWithExpiration = await cachedResponse.json(); // 캐시된 데이터의 만료 시간과 데이터 추출
            const { value: data, expiration } = dataWithExpiration;

            if (Date.now() < expiration) {
            // 캐시된 데이터가 만료되지 않았으면 실행
            setSearchResults(data); // 캐시된 데이터를 검색 결과로 사용
            return; // 함수 종료
            } else {
            // 캐시된 데이터가 만료된 경우 실행
            await cache.delete(value); // 캐시에서 해당 데이터 삭제
            setSearchResults([]); // 검색 결과 초기화하여 보여주지 않음
            }
        }

        // 서버에서 새로운 데이터를 가져와서 캐시에 저장
        const cacheExpireTime = 5 * 60 * 1000; // 캐시 만료 시간: 5분 (5 * 60초를 밀리초로 변환)
        try {
            const data = await getSicks(value); // 서버에서 새로운 검색 결과 데이터 가져옴
            setSearchResults(data); // 새로운 검색 결과를 보여줌
            const expiration = Date.now() + cacheExpireTime; // 캐시 만료 시간 계산
            const dataWithExpiration = {
            value: data,
            expiration,
            };
            const response = new Response(JSON.stringify(dataWithExpiration), {
            headers: { 'Cache-Control': `max-age=${cacheExpireTime / 1000}` },
            });
            cache.put(value, response); // 캐시에 새로운 검색 결과를 저장
        } catch (error) {
            console.error('Error while fetching search results:', error);
            setSearchResults([]); // 검색 결과를 초기화하여 보여주지 않음
        }
    };

    ```
### 입력마다 API 호출하지 않도록 API 호출 횟수를 줄이는 전략 수립 및 실행
#### 디바운싱(Debouncing) vs 쓰로틀링(Throttling)
- 디바운싱 (Debouncing)
    - 입력 이벤트를 그룹화하여 일정 시간 동안 중복 호출을 방지. 따라서 연속적인 입력에 대해 하나의 호출로 처리되어 API 호출 횟수를 줄일 수 있음. 주로 사용자가 입력을 멈추기를 기다리는 기능에 적합.
- 쓰로틀링 (Throttling)
    - 일정 시간 간격으로 입력 이벤트를 그룹화하여 실행함. 따라서 짧은 주기로 연속적인 입력에 대해 API 호출을 제한할 수 있으며, 실시간성을 유지하면서 API 호출 횟수를 줄일 수 있다.
#### API 호출 횟수를 줄이는 전략 선정 : 디바운싱 (Debouncing)
- 호출 횟수를 최소화 하기 위해 검색창에 텍스트를 입력할 때 마다 연손적으로 발생하는 이벤트를 제어 할 필요가 있음. 사용자의 입력이 언제 마무리 될지 모르는 상황 -> 사용자가 타이핑을 멈추기를 기다렸다가 마지막 입력으로 한 번의 검색 호출을 하는 경우에 유용한 <b>디바운싱 (Debouncing)</b> 채택
- 구현 코드
    - useDeounce 커스텀 훅 생성 
    ```js
        import { useRef } from 'react';

        export function useDebounce<T>(callback: (...params: T[]) => void, time: number) {
        const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
        
        return (...params: T[]) => {
            if (timer.current) clearTimeout(timer.current);

            timer.current = setTimeout(() => {
            callback(...params);
            timer.current = null;
            }, time);
        };
        }
    ```
    -  setTimeout을 활용하여 입력이 발생할 때마다 타이머를 리셋하여 일정 시간 이후에 콜백 함수를 실행하도록 함. 따라서 사용자가 입력을 계속하면 타이머가 리셋되고, 입력이 멈추면 타이머가 만료되어 API 호출이 수행된다.

    - SearchBar.tsx
    ```js
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

    ```
    - handleOnChangeInput 함수는 검색어 입력 필드에 변화가 있을 때마다 호출됨.
    - useDebounce hook을 사용하여 handleOnChangeInput 함수가 실행되는 횟수를 제한함. 
    - 검색어 입력이 연속적으로 이루어지는 동안에는 useDebounce에 의해 지정된 1000ms(1초)의 디바운스 시간 동안 여러 번 호출되어도 fetchSearchResults 함수가 실행되지 않는다.
    - 입력이 멈추면 1초 이후에 fetchSearchResults 함수가 호출되어 API를 호출하고, 검색 결과를 가져온다.
### 키보드만으로 추천 검색어들로 이동 가능하도록 구현
#### 사용법
-  검색창에서 키워드를 검색 한 후 키보드 ⬇️ 버튼으로 추천 검색 결과로 이동 가능
- 추천 검색 결과에서 키보드 ⬆️ 버튼으로 검색창으로 이동 가능

#### 구현결과

![Alt text](/src/assets/img/README_keyboard_example.gif)
<br />
