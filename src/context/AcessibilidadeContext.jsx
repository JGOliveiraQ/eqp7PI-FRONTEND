import { createContext, useContext, useState } from 'react'


const AcessibilidadeContext = createContext(null)

export function AcessibilidadeProvider({ children }) {
  const [modoIdoso, setModoIdoso] = useState(false)

  const alternarModoIdoso = () => setModoIdoso((anterior) => !anterior)
  const valor = { modoIdoso, alternarModoIdoso }

  return (
    <AcessibilidadeContext.Provider value={valor}>
      {children}
    </AcessibilidadeContext.Provider>
  )
}

export function useAcessibilidade() {
  const contexto = useContext(AcessibilidadeContext)

  if (!contexto) {
    throw new Error(
      'useAcessibilidade deve ser usado dentro de AcessibilidadeProvider'
    )
  }

  return contexto
}
