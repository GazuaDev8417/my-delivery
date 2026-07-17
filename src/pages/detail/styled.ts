import styled from 'styled-components'




export const Container = styled.div`
    margin-top: 2vh;
    display: flex;
    justify-content: center;

    @media(max-width: 830px){
        margin-top: 7vh;
    }

    @media(max-width: 400px){
        margin-top: 15vh;
    }
`

// 2. Clear separation for the main restaurant layout card
export const RestaurantCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid red;
    width: 70vw;
    margin: 0 auto 10vh;

    .image {
        margin-top: 20px;
        box-shadow: 2px 2px 4px;
        border-radius: 10px;
        max-width: 100%;
        object-fit: cover; /* Prevents image squishing and distortion */
    }

    .location {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 30px;
        border: 1px solid;
        padding: 10px;
        border-radius: 10px;
        transition: .5s ease-in;
        background: transparent;
        cursor: pointer;
    }

    .location:active {
        transform: scale(.9);
    }

    .desc {
        margin: 30px 20px;
    }

    .rest-name {
        text-align: center;
        font-size: 1.5rem;
        margin: 20px 10px 10px;
    }

    .products {
        border-bottom: 1px solid gray;
        text-align: center;
        padding: 10px;
        margin: 10px;
        width: 100%;
        max-width: 500px;
    }

    .products-container {
        max-height: 400px;
        overflow-y: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media(max-width: 830px) {
        width: 80vw;

        .image {
            height: 70vh;
            width: 70vw;
        }

        .desc {
            font-size: 85%;
        }
    }

    @media(max-width: 620px) {
        .image {
            height: 30vh;
        }
    }
`

// 3. Isolated horizontal scrolling category bar
export const CategoriesBar = styled.div`
    display: flex;
    gap: 1rem;
    width: 100%;
    max-width: 500px;
    overflow-x: auto;
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;

    /* Hide standard scrollbars for a cleaner UI while maintaining native scroll physics */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }

    h3 {
        white-space: nowrap;
        cursor: pointer;
        transition: color 0.2s;
    }

    @media(hover: hover) and (pointer: fine) {
        h3:hover {
            color: red !important;
        }
    }

    @media(max-width: 620px) {
        max-width: 250px;
        overflow-x: scroll;
        margin-bottom: 20px;
    }
`

// 4. Isolated Product Card styling
export const ProductCard = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid;
    border-radius: 10px;
    box-shadow: 2px 2px 4px;
    margin: 10px;
    padding: 10px;
    width: 60vw;
    max-width: 700px;

    .product-image {
        border-radius: 10px;
        max-width: 120px;
        height: auto;
        object-fit: cover;
    }

    .product-desc {
        margin: 10px;
        flex-grow: 1; /* Allows desc to take up free space nicely */
    }

    .select-btn-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    button {
        padding: 10px;
        color: #fff;
        font-size: 1.2rem;
        width: 100px;
        cursor: pointer;
    }

    @media(max-width: 830px) {
        flex-direction: column;
        padding: 15px;
        width: 90%;

        .product-image {
            width: 50%;
            max-width: 150px;
            margin-bottom: 10px;
        }

        .select-btn-container {
            justify-content: space-between;
            width: 100%;
            padding: 5px 10px;
            flex-direction: row-reverse;
            align-items: center;
        }

        .select {
            width: 20%;
        }
    }
`