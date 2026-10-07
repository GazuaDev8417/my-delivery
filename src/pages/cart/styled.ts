import styled from 'styled-components'

export const Container = styled.div`
    width: 100%;
    max-width: 800px;
    margin: 90px auto 0; /* Reduced margin top to fit neatly below header */
    padding: 0 1.5rem 180px; /* Generous bottom padding so text never goes under the fixed footer */
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    h1 {
        text-align: center;
        margin: 1rem 0;
        font-size: 2rem;
        font-weight: 700;
        color: #222;
    }

    .address-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        padding: 1.2rem;
        line-height: 1.6;
        border-radius: 12px;
        box-sizing: border-box;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        margin-bottom: 1rem;

        .icon {
            font-size: 1.4rem;
            cursor: pointer;
            color: #6c757d;
            transition: color 0.2s;
            padding: 6px;

            &:hover {
                color: #b11717;
            }
        }
    }

    .addressAndName {
        margin: 1rem 0 0.5rem;
    }

    .rest-name {
        text-align: center;
        font-size: 1.4rem;
        font-weight: 600;
        color: #333;
    }

    /* THE CRITICAL FIX: Independent scrollable zone for products */
    .cart-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 0.5rem;
        max-height: 40vh; /* Limits height to prevent pushing past the viewport */
        overflow-y: auto; /* Enables vertical scrolling inside the list */
        padding-right: 5px; /* Spacing for the scrollbar */

        /* Modern thin scrollbar styles */
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        &::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 4px;
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #999;
        }
    }

    .card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        width: 100%;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 1rem;        
        box-sizing: border-box;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

        img {
            width: 90px;
            height: 90px;
            object-fit: cover;
            border-radius: 8px;  
        }

        .product-name {
            color: #b11717;
            margin: 0 0 0.5rem 0;
            font-size: 1.3rem;
            font-weight: 600;
        }

        .product-details {
            font-size: 0.95rem;
            line-height: 1.5;
            color: #666;
        }
    }

    .btn-container {
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        gap: 0.8rem;

        .input-number {
            width: 65px;
            padding: 0.4rem;
            border: 1px solid #ccc;
            border-radius: 6px;
            text-align: center;
        }
    }

    .btn-remove {
        padding: 0.5rem 1rem;
        background-color: #fff;
        color: #dc3545;
        border: 1px solid #dc3545;
        border-radius: 6px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: background-color 0.2s, color 0.2s;

        &:hover {
            background-color: #dc3545;
            color: #fff;
        }
    }

    /* Pix Container Box (placed inside scroll stream or above fixed footer) */
    .payment-gateway-pix-box {
        width: 100%;
        background-color: #f8f9fa;
        border: 1px dashed #00bfa5;
        border-radius: 12px;
        padding: 1rem;
        box-sizing: border-box;
        margin: 1rem 0;
        text-align: center;
    }

    /* FIXED BOTTOM BAR CONTROL */
    .total-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: white;
        padding: 1.2rem 1.5rem;
        border-top: 1px solid #e9ecef;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
        z-index: 100;
    }

    .totalByGroup {
        font-size: 1.3rem;
        font-weight: 700;
        color: #222;
    }

    .payment-action-hub {
        width: 100%;
        max-width: 480px;
    }

    .requestOrder-btn {
        width: 100%;
        max-width: 480px;
    }

    @media(max-width: 576px) {
        padding-bottom: 200px; /* More safety room for stacked buttons on mobile screen floors */

        .card {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .btn-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            border-top: 1px solid #f1f3f5;
            padding-top: 0.5rem;
        }
    }
`