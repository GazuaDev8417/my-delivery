import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    padding: 1rem;
    
    .title {
        font-size: 2rem;
        margin-bottom: 2rem;
        font-weight: 500;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
        max-width: 320px;
    }

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
        padding: .75rem 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
        width: 100%;
        margin: 5px;
        box-shadow: 1px 1px 4px;
    }

    .form-input:focus {
        border: 1px solid #b11717;
        box-shadow: 0 0 4px #000;
        outline: none;
    }

    /* 1. We keep this clean as a basic container for inputs */
    .input-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .btn-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-left: 10px;
        gap: 10px;
    }
 
    .login-button {
        padding: 10px;
        color: white;
        font-size: 1rem;
        font-weight: 500;
        box-shadow: 1px 1px 4px black;
        background: #990f0f;
        cursor: pointer;
        border-radius: 5px;
        border: none;
    }

    .login-button:hover {
        box-shadow: 0 0 6px #a11414;
    }

    .login-button:focus {
        outline: 3px solid #a11414;
        box-shadow: 0 0 6px #000;
    }

    .submit-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        width: 100%;
    }

    .signup-button {
        width: 100%;
        padding: 0.75rem;
        color: white;
        background-color: #b11717; /* Defined clear default fallback background state */
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        transition: background-color 0.2s, box-shadow 0.2s, transform 0.1s;

        &:hover {
            background-color: #990f0f;
            box-shadow: 0 4px 8px rgba(153, 15, 15, 0.3);
        }

        &:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(177, 23, 23, 0.4);
        }

        &:active {
            transform: scale(0.98); /* Native press effect feedback */
        }
    }

    p {
        margin-top: 2rem;
        font-size: .9rem;
    }

    a {
        color: #1976d2;
        text-decoration: none;
        font-weight: 500;
    }

    a:hover {
        text-decoration: underline;
    }

    /* MEDIA QUERY FOR WIDTH */
    @media(max-width: 320px) {
        .btn-container {
            width: 100%;
        }
    }
`

export const PasswordFieldWrapper = styled.div`
    position: relative;
    width: 100%;

    .eye-icon {
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%); /* Centers the icon perfectly vertically */
        font-size: 1.2rem;
        cursor: pointer;
        color: #666;
        z-index: 2; /* Ensures it stays on top of the input */
    }
`