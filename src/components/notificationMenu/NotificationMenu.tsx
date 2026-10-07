import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { notifificationService } from "../../services/notifications"
import { useAuth } from "../../global/AuthContext";
import {
    Container, 
    BtnStyle, 
    PopoverMenu,
    NotificationDot,
    HeaderContainer,
    TextButton,
    NotificationContainer,
    Content,
    Title,
    Time,
    UnreadDot
} from "./styled"
import { FaRegBell, FaBell } from "react-icons/fa";





interface NotificationItemProps{
    title:string
    time:string
    unread?:boolean
    onClick: () => void
}



export default function NotificationMenu(){
    const navigate = useNavigate()
    const { notifications, setNotifications } = useAuth()
    const menuRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState<boolean>(false)
    
    

    useEffect(()=>{
        async function loadNotifications(){
            try{
                const data = await notifificationService.getNofifications()
                setNotifications(data)
            }catch(e:any){
                console.error(e?.response?.data?.message || e?.response?.data || e?.message)
            }
        }
        loadNotifications()
    }, [])



    useEffect(()=>{
        function handleClickOutside(event:MouseEvent){
            if(menuRef.current && !menuRef.current.contains(event.target as Node)){
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(()=>{
        function handleEscape(event:KeyboardEvent){
            if(event.key === 'Escape'){
                setOpen(false)
            }            
        }
        document.addEventListener('keydown', handleEscape)

        return () => document.removeEventListener('keydown', handleEscape)
    }, [])


    async function handleNotificationClick(id:string, message:string, provider:string){
        try{
            await notifificationService.updateNotification(id)

            setNotifications(current =>
                current.map(notification =>
                    notification.id === id
                        ? { ...notification, is_read: true }
                        : notification
                )
            )

            if(message.includes('deleted its account')){
                navigate('/')
            }

            if(
                message.includes('added to') 
                ||  message.includes('is running low') 
                ||  message.includes('has increased')
                ||  message.includes('was removed from')
                ||  message.includes('is now on My Delivery!')
            ){
                navigate(`/detail`)
                sessionStorage.setItem('providerId', provider)
            }
        }catch(e:any){
            console.error(e?.response?.data?.message || e?.response?.data || e?.message)
        }        
    }


    async function handleMarkAllAsRead(){
        try{
            await notifificationService.updateAllNotifications()

            setNotifications(current =>
                    current.map(notification => ({
                        ...notification,
                        is_read: true
                    })
                )
            )
        }catch(e:any){
            console.error(e?.response?.data?.message || e?.response?.data || e?.message)
        }
    }

 
    const unreadCount = notifications.filter(notification => !notification.is_read).length
    const hasUnread = notifications.some(notification => !notification.is_read)
    


    return(
        <Container>
            <div className="position-container" ref={menuRef}>
                <BtnStyle
                    onClick={() => setOpen((prev) => !prev)}>
                    {unreadCount > 0 ? (
                        <>
                            <FaBell className="header-icon"/>
                            <NotificationDot/>
                        </>
                    ) : (
                        <FaRegBell className="header-icon"/>
                    )}
                </BtnStyle>

                <PopoverMenu $open={open}>
                    <HeaderContainer>
                        <h3 className="font-style">Notifications</h3>
                        {hasUnread && (
                            <TextButton
                                onClick={handleMarkAllAsRead}>Mark all as read</TextButton>
                        )}
                    </HeaderContainer>

                    <div className="notification-item-container">
                        {notifications.length > 0 ? (
                            notifications.map((notification)=>(
                            <NotificationItem
                                key={notification.id}
                                title={notification.notification}
                                time={notification.created_at}
                                unread={!notification.is_read}
                                onClick={() => handleNotificationClick(
                                    notification.id, 
                                    notification.notification,
                                    notification.provider
                                )}/>
                            ))
                        ) : (
                            <div className="no-notification-container">
                                No notifications
                            </div>
                        )}
                    </div>
                    <div className="ht-bottom"/>
                </PopoverMenu>
            </div>
        </Container>    
    )
}


function NotificationItem({ title, time, unread = false, onClick }:NotificationItemProps){
    return(
        <NotificationContainer onClick={onClick}>
            <Content>
                <div>
                    <Title>{title}</Title>
                    <Time>
                        {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Time>
                </div>
                {unread && <UnreadDot />}
            </Content>
        </NotificationContainer>
    )
}