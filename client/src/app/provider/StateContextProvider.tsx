'use client'
import React, { createContext, useContext, useState } from 'react';
import Header from '@/app/components/Header';
import LoadingModal from '@/app//components/LoadingModal';
import { IState, StateContextType } from '@/app/type/Contract'
import Notification from '@/app/components/Notification';
import NotificationParam from '@/app/type/NotificationParam'
import { NotificationType } from "../../../constants";
export const initNotificationParam:NotificationParam = {
    title:'',
    message: '',
    yesTitle:'',
    showYes:true,
    noTitle:'',
    showCancel:true,
    noticeType: NotificationType.DENGER,
    yesCallback:() => {},
    cancelCallback:() => {}
}

export const initState:IState = {
    currentAccount: null,
    messageValue: "",
    nftBalance: 0,
    loading: false,
    showNotification: false,
    notificationParam:initNotificationParam
}

const StateContext = createContext<StateContextType | null>({
    state: initState,
    updateState: (state: IState) => null
})

export function StateContextProvider({ children }:{children: React.ReactNode}) {
    const [state, setState] = useState<IState>(initState);
    const updateState = (state:IState) => {
        setState(state)
    }
    const toggleNotice = (isShow:boolean, notificationParam:NotificationParam) => {
        toggleNotice(isShow, notificationParam)
    }

    return (
        <StateContext.Provider value={{ state, updateState }}>
          <Header />
          {children}
          {state.loading && <LoadingModal />}
          {state.showNotification && <Notification />}
        </StateContext.Provider>
       )
}

export const useStateContext = () => {
    const context = useContext(StateContext)
    if (!context) {
      throw new Error('stateContext must be used within a NewUserFormContextProvider')
    }
  
    return context
}