import { Routes, Route } from 'react-router-dom'
import { useAcessibilidade } from './context/AcessibilidadeContext'
import Home from './pages/Home'
import Agendamento from './pages/Agendamento'
import Unidades from './pages/Unidades'
import Perfil from './pages/Perfil'

function App() {
  const { modoIdoso } = useAcessibilidade()

  const estiloBase = modoIdoso ? 'text-idoso-base' : 'text-base'

  return (
    <div className={`min-h-screen bg-gray-50 ${estiloBase}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/unidades" element={<Unidades />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </div>
  )
}

export default App
