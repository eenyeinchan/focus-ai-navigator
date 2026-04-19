import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { ThemeProvider } from "@/components/theme-provider";

import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import NotesList from "@/pages/notes/index";
import NoteEditor from "@/pages/notes/editor";
import TasksList from "@/pages/tasks";
import FocusMode from "@/pages/focus";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/notes" component={NotesList} />
        <Route path="/notes/new" component={NoteEditor} />
        <Route path="/notes/:id" component={NoteEditor} />
        <Route path="/tasks" component={TasksList} />
        <Route path="/focus" component={FocusMode} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="flowmind-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
