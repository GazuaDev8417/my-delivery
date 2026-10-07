import styled from 'styled-components'



export const Container = styled.div`
    margin-top: 2vh;
    display: flex;
    flex-direction: column;
    align-items: center;
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
        object-fit: contain;
        margin-top: 20px;
        box-shadow: 2px 2px 4px;
        border-radius: 10px;
        max-width: 100%;
        object-fit: cover; /* Prevents image squishing and distortion */
        cursor: pointer;
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
        background: red;
        cursor: pointer;
        color: white;
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
        font-size: 1.5rem;
    }

    .products-container {
        max-height: 400px;
        overflow-y: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .productCard-container{
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