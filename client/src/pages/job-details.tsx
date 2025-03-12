import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/common/footer";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function JobDetails() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState("");
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const jobId = params.id;

  // Fetch job details
  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`/api/jobs/${jobId}`],
    enabled: !!jobId,
    refetchOnWindowFocus: false,
  });

  // Apply to job mutation
  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/jobs/${jobId}/apply`, {
        coverLetter,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been sent to the recruiter",
      });
      setApplyDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/freelancers/applications/my"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-8">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation("/jobs")}>
              Back to Job Listings
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-gray-600 mt-1">
                    {job.company} • {job.location}
                  </p>
                </div>
                <Badge className="mt-2 md:mt-0 bg-green-100 text-green-800 self-start md:self-center py-1 px-3">
                  {job.budget}
                </Badge>
              </div>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                  <CardDescription>
                    Posted by {job.recruiterName || "Recruiter"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Overview</h3>
                    <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired && job.skillsRequired.length > 0 ? (
                        job.skillsRequired.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No specific skills listed</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                      <p className="text-gray-900">{job.location || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                      <p className="text-gray-900">{job.deadline}</p>
                    </div>
                  </div>

                  {user?.role === "freelancer" ? (
                    <Dialog
                      open={applyDialogOpen}
                      onOpenChange={setApplyDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="w-full md:w-auto">Apply Now</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply for {job.title}</DialogTitle>
                          <DialogDescription>
                            Introduce yourself and explain why you're a good fit for this job
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Cover Letter</label>
                            <Textarea
                              placeholder="Describe your experience, relevant skills, and why you're interested in this position..."
                              rows={6}
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => applyMutation.mutate()}
                            disabled={!coverLetter.trim() || applyMutation.isPending}
                          >
                            {applyMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              "Submit Application"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : user?.role === "recruiter" ? (
                    <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-blue-700">
                        You're viewing this job as a recruiter. Switch to a freelancer account to apply.
                      </p>
                    </div>
                  ) : (
                    <Button onClick={() => setLocation("/auth")}>
                      Login to Apply
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/jobs")}
                >
                  Back to Jobs
                </Button>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {job.applications?.length || 0}{" "}
                    {job.applications?.length === 1 ? "application" : "applications"} so far
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
