import {
    type ChangeEvent,
    type FC,
    useContext,
    useEffect,
    useState,
    useRef,
    useMemo
} from 'react'
import { useNavigate } from 'react-router-dom'
import Context,  { type GlobalStateContextType } from '../../global/Context'
import Header from '../../components/Header'
import { IoPersonOutline, IoCartOutline } from 'react-icons/io5'
import { FaMapMarkerAlt } from 'react-icons/fa'
import type { Products, Restaurant } from '../../types/types'
import { Container, RestaurantCard, CategoriesBar, ProductCard } from './styled'
import { AppRoutes } from '../../routes/path'
import { restaurantService } from '../../services/restaurant'




type GroupedProducts = {
    category:string
    items:Products[]
}




const Detail:FC = ()=>{
    const navigate = useNavigate()
    const productsRef = useRef<HTMLDivElement | null>(null)
    const { getAllOrders } = useContext(Context) as GlobalStateContextType
    const token = localStorage.getItem('token')
    const [restaurant, setRestaurant] = useState<Restaurant>({
        id: '',
        name: '',
        category: '',
        address: '',
        phone: '',
        description: '',
        cnpj: '',
        logourl: ''
    })
    const [products, setProducts] = useState<Products[]>([])
    const [openCategory, setOpenCategory] = useState<string | null>(null)
    const [searchWord, setSearchWord] = useState<string>('')



    useEffect(()=>{
        const loadPageData = async()=>{
            try{
                const [restaurantData, productsData] = await Promise.allSettled([
                    restaurantService.getRestaurant(),
                    restaurantService.getProducts()
                ])

                if(restaurantData.status === 'fulfilled'){
                    setRestaurant(restaurantData.value)
                }else{
                    const error = restaurantData.reason
                    console.error(error?.response?.data?.message || error?.resonse?.data || error)
                }
                
                if(productsData.status === 'fulfilled'){
                    setProducts(productsData.value)
                }else{
                    const error = productsData.reason
                    console.error(error?.response?.data?.message || error?.resonse?.data || error)
                }
            }catch(e:any){
                const errorMessage = e?.response?.data?.message || e?.response?.data
                console.error(errorMessage)
            }
        }

        loadPageData()
    }, [])

    useEffect(()=>{
        if(openCategory && productsRef.current){
            productsRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [openCategory])


    const groupedProducts = useMemo((): GroupedProducts[]=>{
        const grouped = products.reduce((acc, product)=>{
            const categoryKey = product.category.trim()

            if(!acc[categoryKey]){
                acc[categoryKey] = { category: categoryKey, items:[] }
            }
            acc[categoryKey].items.push(product)
            return acc
        }, {} as Record<string, GroupedProducts>)

        return Object.values(grouped)
    }, [products])


    const request = async(product:Products)=>{
        if(!token){
            const decide = window.confirm('You must login to place orders')
            if(decide){
                navigate(AppRoutes.LOGIN)
            }
            return
        }

        const now = new Date().toISOString()
        const body = {
            product: product.name, 
            price: product.price,
            photoUrl: product.photoUrl,
            quantity: 1,
            total: product.price,  
            momentString: now,
            description: product.description
        }

        try{
            const sucessMessage = await restaurantService.createOrder(body, token)
            getAllOrders()

            const decide = confirm(sucessMessage)
            if(decide){
                navigate(AppRoutes.CART)
            }
        }catch(e:any){
            const decide = confirm(e.message)
            if(decide){
                navigate(AppRoutes.CART)
            }
        }
    }


    const handleInputSearch = (e:ChangeEvent<HTMLInputElement>)=>{
        if(openCategory === null){
            alert('Select the product type to search')
        }
        setSearchWord(e.target.value)
    }


    const getPlace = ()=>{
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`
        window.open(url, '_blank') 
    }



    return(
        <>
            <Header
                leftIcon={
                    token ? (
                        <IoCartOutline className="header-icon" onClick={() => navigate(AppRoutes.CART)} />
                    ) : <div/>
                }
                rightIcon={
                    token ? (
                        <IoPersonOutline className="header-icon" onClick={() => navigate(AppRoutes.PROFILE)} />
                    ) : <div/>
                }/>

                <Container>
                    <RestaurantCard>
                        <div className="rest-name">{restaurant.name}</div>
                        <img 
                            src={`/imgs/restaurants/${restaurant.logourl}`}
                            alt="Imagem do restaurante"
                            className="image"
                        />
                        <button className="location" onClick={getPlace}>
                            Location
                            <FaMapMarkerAlt />
                        </button>               
                        <div className="desc">
                            <p>{restaurant.description}</p>
                        </div>
                        <div className="products" title="Clique em uma das categorias abaixo">Menu</div>
                        
                        {/* Categories Navigation Bar */}
                        <CategoriesBar title="Clique para ver os produtos">
                            {groupedProducts.map(group => (
                                <h3 
                                    key={group.category} 
                                    onClick={() => setOpenCategory(group.category)}
                                    style={{ color: openCategory === group.category ? "red" : "black" }}
                                >
                                    {group.category}
                                </h3>
                            ))}
                        </CategoriesBar>

                        {/* Search Bar */}
                        <input 
                            style={{ margin: 10, width: '50%' }}
                            type="text" 
                            value={searchWord}
                            onChange={handleInputSearch}
                            placeholder="Search product"
                        />

                        {/* Filtered Products Container */}
                        <div className="products-container" ref={productsRef}>
                            {groupedProducts.map(group => (
                                openCategory === group.category && (
                                    <div key={group.category} className='productCard-container'>
                                        {group.items
                                            .filter(product => product.name.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase()))
                                            .map(product => (
                                                <ProductCard key={product.id}>
                                                    <img
                                                        className="product-image" 
                                                        src={product.photoUrl}
                                                        alt={product.name}
                                                    />
                                                    <div className="product-desc">
                                                        <h4>{product.name}</h4><br/>
                                                        {product.description}<br/><br/>
                                                        <div>R$ {Number(product.price).toFixed(2)}</div>
                                                    </div>
                                                    <button 
                                                        className="btn-primary"
                                                        onClick={() => request(product)}
                                                    >
                                                        Order
                                                    </button>                                    
                                                </ProductCard>
                                            ))
                                        }
                                        {group.items.filter(product => (
                                            product.name.toLocaleLowerCase().includes(searchWord.toLowerCase())
                                        )).length === 0 && (
                                            <p>No product found in this category</p>
                                        )}
                                    </div>
                                )
                            ))}
                        </div>
                    </RestaurantCard>
                </Container>
        </>
    )
}


export default Detail