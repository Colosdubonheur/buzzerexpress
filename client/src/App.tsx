import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { HostPage } from './pages/HostPage'
import { ParticipantPage } from './pages/ParticipantPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/host/:code" element={<HostPage />} />
        <Route path="/join/:code" element={<ParticipantPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
