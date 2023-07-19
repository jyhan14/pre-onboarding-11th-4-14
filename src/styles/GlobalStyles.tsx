import { createGlobalStyle } from 'styled-components';
import NotoSansKR_Medium from '../assets/Fonts/NotoSansKR_Medium.otf';
import NotoSansKR_Regular from '../assets/Fonts/NotoSansKR_Regular.otf';
export const GlobalStyles = createGlobalStyle`

@font-face {
    font-family: 'NotoSansKR';
    src: local('NotoSansKR_Medium'), url(${NotoSansKR_Medium});
    font-weight: 500;
}

@font-face {
    font-family: 'NotoSansKR';
    src: local('NotoSansKR_Regular'), url(${NotoSansKR_Regular});
    font-weight: 400;
}

    * {
        border: 0 solid #e5e7eb;
        box-sizing: border-box;
    }
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video, button {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        /* font: inherit; */
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        line-height: 1;
        background-color: #e9ecef;
        font-family: NotoSansKR;
    }
    div, input{
        box-sizing : border-box;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
`;
