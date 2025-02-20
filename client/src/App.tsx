import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import Sidebar from "./components/Sidebar";
import NotFound from "./pages/not-found";

// Lazy load page components
import { lazy, Suspense } from "react";
const Home = lazy(() => import("./pages/home"));
const Tasks = lazy(() => import("./pages/tasks"));
const Calendar = lazy(() => import("./pages/calendar"));
const Settings = lazy(() => import("./pages/settings"));

function Router() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;