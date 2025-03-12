import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import FreelancerDashboard from "@/pages/freelancer-dashboard";
import RecruiterDashboard from "@/pages/recruiter-dashboard";
import JobListings from "@/pages/job-listings";
import PostJob from "@/pages/post-job";
import JobDetails from "@/pages/job-details";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/freelancer/dashboard" component={FreelancerDashboard} />
      <ProtectedRoute path="/recruiter/dashboard" component={RecruiterDashboard} />
      <Route path="/jobs" component={JobListings} />
      <Route path="/jobs/:id" component={JobDetails} />
      <ProtectedRoute path="/post-job" component={PostJob} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
