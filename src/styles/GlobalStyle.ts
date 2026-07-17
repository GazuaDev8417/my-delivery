import { createGlobalStyle } from "styled-components"



export const GlobalStyle = createGlobalStyle`
    *, *::before, *::after{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html{
        scroll-behavior: smooth;
        
        &::-webkit-scrollbar{
            width: 0.7rem;
        }
        
        &::-webkit-scrollbar-track{
            background: #e0e0e0;
        }

        &::-webkit-scrollbar-thumb{
            background: #b11717;
            border-radius: 5rem;
            &:hover{
                background: #990f0f;
            }
        }
    }

    body {
        font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background-color: #fcfcfc;
        color: #333333;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .logo-title {
        font-family: 'Bebas Neue', Impact, sans-serif;
        letter-spacing: 2px;
        color: #a52a2a;
        cursor: pointer;

        @media (max-width: 400px) {
        font-size: 1rem;
        }
    }

    input:not([type="checkbox"]):not([type="radio"]) {
        border-radius: 5px;
        border: 1px solid #cccccc;
        outline: none;
        font-size: 1rem;
        height: 40px;
        padding-left: 10px;
        transition: border-color 0.2s ease-in-out;

        &:focus {
            border-color: #b11717;
        }
    }

    .btn-primary {
        border: none;
        border-radius: 5px;
        background-color: #b11717;
        padding: 0.75rem 1.5rem;
        color: white;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        outline: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &:hover {
            box-shadow: 0 4px 8px rgba(177, 23, 23, 0.3);
            background-color: #990f0f;
        }

        &:active {
            transform: scale(0.97); /* Subtle scale is smoother than 0.9 */
        }
    }

    .header-icon {
        font-size: 2rem;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        
        &:hover {
        color: #b11717;
        }
        
        &:active {
        transform: scale(0.95);
        }

        @media (max-width: 420px) {
        font-size: 1.7rem;
        }
    }
`