import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    min-height: 90vh; /* Smooth, flexible height scaling instead of hardcoded 100vh */
    padding: 3rem 1.5rem;
    box-sizing: border-box;
    width: 100%;
    position: relative; /* Context anchor for the back arrow icon */

    .back-icon-btn {
        position: absolute;
        top: 2rem;
        left: 2rem;
        font-size: 1.8rem;
        cursor: pointer;
        color: #333;
        transition: color 0.2s, transform 0.1s;
        padding: 4px;

        &:hover {
            color: #b11717; /* Elegant brand red hover feedback */
        }

        &:active {
            transform: scale(0.9);
        }

        @media(max-width: 480px) {
            top: 1.5rem;
            left: 1rem;
            font-size: 1.6rem;
        }
    }

    img {
        width: 120px;
        margin-bottom: 1rem;
        object-fit: contain;
    }

    .title {
        font-size: 1.8rem;
        margin: 1.5rem 0 2rem;
        font-weight: 600;
        color: #333;
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
        max-width: 360px; /* Elegant, industry-standard limit for form layouts */
    }

    /* Screen-reader only utility */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .form-input {
        padding: 0.75rem 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
        width: 100%;
        box-sizing: border-box;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Modern subtle shadow */
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus {
        border-color: #b11717;
        box-shadow: 0 0 0 3px rgba(177, 23, 23, 0.2); /* Beautiful focal glow */
        outline: none;
    }

    .btn-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        width: 100%;
        margin-top: 10px;
    }

    .address-button {
        flex: 1; /* Both buttons split the space 50/50 automatically */
        padding: 0.75rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        transition: background-color 0.2s, box-shadow 0.2s, transform 0.1s;

        &:active {
            transform: scale(0.98);
        }
    }

    /* Clear / Reset Button styling */
    .clear-btn {
        background-color: #f1f1f1;
        color: #333;
        box-shadow: none;
        border: 1px solid #ccc;

        &:hover {
            background-color: #e2e2e2;
        }
    }

    /* Primary submit button */
    .submit-btn {
        background-color: #b11717;
        color: white;

        &:hover {
            background-color: #990f0f;
            box-shadow: 0 4px 8px rgba(153, 15, 15, 0.3);
        }

        &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(177, 23, 23, 0.4);
        }
    }

    @media(max-width: 480px) {
        .title {
            font-size: 1.5rem;
        }
    }
`