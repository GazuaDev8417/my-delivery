export const AppRoutes = {
    HOME: '/',
    CART: '/cart',
    PROFILE: '/profile', 
    EDIT_PROFILE: '/edit-profile',
    ADDRESS: '/user-address',
    LOGIN: '/login',
    RESET_PASSWORD: '/reset-request'
} as const


export type AppRoutesType = typeof AppRoutes[keyof typeof AppRoutes]