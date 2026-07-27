export interface Restaurant{
    id:string
    name:string
    category:string
    address:string
    phone:string
    description:string
    cnpj:string
    logourl:string
}

export interface Products{
    category:string
    description:string
    id:string
    name:string
    photoUrl:string
    price:number
}

export interface User{
    id:string
    username:string
    email:string
    street:string,
    number:string
    neighbourhood:string
    city:string
    state:string
    complement:string
    phone:string
    cep:string
}

export interface Order{
    id:string
    product:string 
    price:number
    photoUrl:string
    quantity:number
    total:number
    moment:string 
    client:string
    state:string
    address:string
    description:string
    paymentmethod:string
}