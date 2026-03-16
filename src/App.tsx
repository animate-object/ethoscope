import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeView } from './views/home/HomeView';
import { BehaviorSchemaListView } from './views/behaviorSchema/BehaviorSchemaListView';
import { BehaviorSchemaView } from './views/behaviorSchema/BehaviorSchemaView';
import { ObservationNewView } from './views/observation/ObservationNewView';
import { ObservationView } from './views/observation/ObservationView';
import { SessionCompleteView } from './views/observation/SessionCompleteView';
import { AnalysisView } from './views/analysis/AnalysisView';
import { OptionsView } from './views/options/OptionsView';
import { DevToolsView } from './views/options/DevToolsView';

const SessionDetailView = lazy(() =>
  import('./views/analysis/SessionDetailView').then(m => ({ default: m.SessionDetailView }))
);

function App() {
  return (
    <BrowserRouter basename="/ethoscope/">
      <Suspense>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/behavior-schemas" element={<BehaviorSchemaListView />} />
        <Route path="/behavior-schema" element={<BehaviorSchemaView />} />
        <Route path="/behavior-schema/:id" element={<BehaviorSchemaView />} />
        <Route path="/observation" element={<ObservationNewView />} />
        {/* /complete must come before /:schemaId so it isn't treated as a param */}
        <Route path="/observation/complete" element={<SessionCompleteView />} />
        <Route path="/observation/:schemaId" element={<ObservationView />} />
        <Route path="/analysis" element={<AnalysisView />} />
        <Route path="/analysis/session/:id" element={<SessionDetailView />} />
        <Route path="/options" element={<OptionsView />} />
        <Route path="/options/dev-tools" element={<DevToolsView />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
