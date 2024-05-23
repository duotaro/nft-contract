'use client'
import React, { createContext, useContext, useState } from 'react';
import Header from '@/app/components/Header';
import { FB_CONTRACT_ADDRESS } from "../../../constants"
import abi from "@/lib/FruitsBox.abi.json"
import LoadingModal from '@/app//components/LoadingModal';
import { IState, StateContextType } from '@/app/type/Contract'

export const initState:IState = {
    currentAccount: null,
    messageValue: "",
    list: [],
    loading: false
}

const StateContext = createContext<StateContextType | null>({
    state: initState,
    updateState: (state: IState) => null
})

export function StateContextProvider({ children }:{children: React.ReactNode}) {
    const [state, setState] = useState<IState>(initState);
    const updateState = (state:IState) => {
        console.log("updateState =>", state)
        setState(state)
    }


    return (
        <StateContext.Provider value={{ state, updateState }}>
          <Header />
          {children}
          {state.loading && <LoadingModal />}
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