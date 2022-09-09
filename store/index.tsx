import React, { ReactElement, useContext } from 'react'
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite'
import createStore, { IStore } from './rootStore'
import { IUserInfo } from './userStore'

const StoreContext = React.createContext({})

interface IProps {
  initialValue?: IUserInfo
  children: ReactElement
}

enableStaticRendering(false)

export const StoreProvider: React.FC<IProps> = ({
  children,
  initialValue,
}) => {
  const store: IStore = useLocalObservable(createStore(initialValue))
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const store: IStore = useContext(StoreContext) as IStore

  if (!store) {
    throw new Error('Data does not exist')
  }

  return store
}