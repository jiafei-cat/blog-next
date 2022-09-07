import React, { ReactElement, useContext } from 'react'
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite'
import createStore, { IStore } from './rootStore'

const storeContext = React.createContext({})

interface IProps {
  initialValue?: {

  }
  children: ReactElement
}

enableStaticRendering(true)

export const StoreProvider: React.FC<IProps> = ({
  children,
  initialValue,
}) => {
  const store: IStore = useLocalObservable(createStore(initialValue))
  return (
    <storeContext.Provider value={store}>
      {children}
    </storeContext.Provider>
  )
}

export const useStore = () => {
  const store: IStore = useContext(storeContext) as IStore

  if (!store) {
    throw new Error('Data does not exist')
  }

  return store
}