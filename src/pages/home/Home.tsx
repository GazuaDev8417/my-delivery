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
import { restaurantService } from '../../services/restaurant'
import { AppRoutes } from '../../routes/path'
import type { Restaurant } from '../../types/types'
import { Container, RestaurantCard } from './styled'



const Home:FC = ()=>{
    const navigate = useNavigate()
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])


console.log('Restaurants',  restaurants)
    
    useEffect(()=>{
        const loadRestaurants = async()=>{
            try{
                const restaurantData = await restaurantService.getRestaurants()
                setRestaurants(restaurantData)
            }catch(e:any){
                const errorMessage = e?.response?.data?.message || e?.response?.data
                console.error(errorMessage)
            }
        }
        loadRestaurants()
    }, [])


    const handleSelectRestaurant = (restaurantId:string)=>{
        sessionStorage.setItem('providerId', restaurantId)
        navigate(AppRoutes.DETAIL)
    }
    

    return(
        <Container>
            {restaurants.map((restaurant)=>(
                <RestaurantCard 
                    onClick={() => handleSelectRestaurant(restaurant.id)}
                    key={restaurant.id}>
                    <div className="rest-name">{restaurant.name}</div>
                    <img 
                        src={`/imgs/restaurants/${restaurant.logourl}`}
                        alt="Imagem do restaurante"
                        className="image"
                    />               
                    <div className="desc">
                        <p>{restaurant.description}</p>
                    </div>
                </RestaurantCard>
            ))}
        </Container>
    )
}

export default Home