import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import RouteScroll from "./components/RouteScroll";
import AnalyticsConsent from "./components/AnalyticsConsent";

const OmAndreas = lazy(() => import("./pages/OmAndreas"));
const KlassiskMassage = lazy(() => import("./pages/KlassiskMassage"));
const AvslappningsmassageUddevalla = lazy(() => import("./pages/AvslappningsmassageUddevalla"));
const MassageMotNackspanning = lazy(() => import("./pages/MassageMotNackspanning"));
const FriskvardsbidragMassageUddevalla = lazy(() => import("./pages/FriskvardsbidragMassageUddevalla"));
const MassageLjungskile = lazy(() => import("./pages/MassageLjungskile"));
const Articles = lazy(() => import("./pages/Articles"));
const DynamicPage = lazy(() => import("./pages/DynamicPage"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center bg-background" role="status">
    <span className="sr-only">Laddar sidan…</span>
    <span aria-hidden="true" className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RouteScroll />
      <AnalyticsConsent />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/om-andreas" element={<OmAndreas />} />
          <Route path="/klassisk-massage" element={<KlassiskMassage />} />
          <Route path="/avslappningsmassage-uddevalla" element={<AvslappningsmassageUddevalla />} />
          <Route path="/massage-mot-nackspanning" element={<MassageMotNackspanning />} />
          <Route path="/friskvardsbidrag-massage-uddevalla" element={<FriskvardsbidragMassageUddevalla />} />
          <Route path="/massage-ljungskile" element={<MassageLjungskile />} />
          <Route path="/kunskapsbank" element={<Articles />} />
          <Route path="/p/:slug" element={<DynamicPage />} />
          <Route path="/integritet" element={<Privacy />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
