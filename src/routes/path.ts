export const AppRoutes = {
    HOME: '/',
    CART: '/cart',
    PROFILE: '/profile', 
    EDIT_PROFILE: '/edit-profile',
    ADDRESS: '/user-address',
    LOGIN: '/login'
} as const


export type AppRoutesType = typeof AppRoutes[keyof typeof AppRoutes]