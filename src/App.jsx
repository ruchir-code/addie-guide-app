import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LevelProvider } from './context/LevelContext'
import { ChecklistProvider } from './context/ChecklistContext'
import AppShell from './components/layout/AppShell'
import Home from './pages/Home'
import PhasePage from './pages/PhasePage'
import ObjectivesPage from './pages/ObjectivesPage'
import TemplatesPage from './pages/TemplatesPage'
import GlossaryPage from './pages/GlossaryPage'
import TheoriesPage from './pages/TheoriesPage'
import BloomPage from './pages/BloomPage'
import MediaGuidePage from './pages/MediaGuidePage'
import ModelsPage from './pages/ModelsPage'
import AssessmentBuilderPage from './pages/AssessmentBuilderPage'
import EvaluationFrameworksPage from './pages/EvaluationFrameworksPage'
import PerformanceConsultingPage from './pages/PerformanceConsultingPage'
import TransferPage from './pages/TransferPage'
import AiInIDPage from './pages/AiInIDPage'
import ScenarioGuidePage from './pages/ScenarioGuidePage'
import AboutPage from './pages/AboutPage'

function NotFound() {
  return (
    <div className="text-center py-16">
      <p className="text-6xl font-black text-gray-200 mb-4">404</p>
      <p className="text-gray-500">Page not found.</p>
      <a href="/" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">
        Back to home
      </a>
    </div>
  )
}

export default function App() {
  return (
    <LevelProvider>
      <ChecklistProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppShell />}>
              <Route index element={<Home />} />
              <Route path=":phase" element={<PhasePage />} />
              <Route path="objectives" element={<ObjectivesPage />} />
              <Route path="templates" element={<TemplatesPage />} />
              <Route path="glossary" element={<GlossaryPage />} />
              <Route path="theories" element={<TheoriesPage />} />
              <Route path="bloom" element={<BloomPage />} />
              <Route path="media-guide" element={<MediaGuidePage />} />
              <Route path="models" element={<ModelsPage />} />
              <Route path="assessment-builder" element={<AssessmentBuilderPage />} />
              <Route path="evaluation-frameworks" element={<EvaluationFrameworksPage />} />
              <Route path="performance-consulting" element={<PerformanceConsultingPage />} />
              <Route path="transfer" element={<TransferPage />} />
              <Route path="ai-in-id" element={<AiInIDPage />} />
              <Route path="scenario-guide" element={<ScenarioGuidePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChecklistProvider>
    </LevelProvider>
  )
}
