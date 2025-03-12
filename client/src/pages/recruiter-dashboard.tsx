import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/common/footer";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function RecruiterDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Get user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/auth/profile"],
    refetchOnWindowFocus: false,
  });

  // Get posted jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/recruiters/jobs/my"],
    refetchOnWindowFocus: false,
  });

  // Get dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/recruiters/dashboard/stats"],
    refetchOnWindowFocus: false,
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      await apiRequest("DELETE", `/api/jobs/${jobId}`);
    },
    onSuccess: () => {
      toast({
        title: "Job deleted",
        description: "The job listing has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recruiters/jobs/my"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recruiters/dashboard/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting job",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update application status mutation
  const updateApplicationMutation = useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: string;
    }) => {
      const res = await apiRequest(
        "PUT",
        `/api/jobs/applications/${applicationId}`,
        { status }
      );
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Application status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recruiters/dashboard/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Custom hook to get applications for a specific job
  const useJobApplications = (jobId: string) => {
    return useQuery({
      queryKey: [`/api/jobs/${jobId}/applications`],
      enabled: !!jobId,
      refetchOnWindowFocus: false,
    });
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <motion.h1
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Recruiter Dashboard
            </motion.h1>
            <motion.p
              className="text-gray-600 mt-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Manage your job listings, track applications, and find talented freelancers
            </motion.p>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Listings</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalListings || 0}</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Applications</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalApplications || 0}</h3>
                    </div>
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Successful Hires</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.successfulHires || 0}</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.activeJobs || 0}</h3>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Your Jobs</h2>
            <Link href="/post-job">
              <Button>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Post New Job
              </Button>
            </Link>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger value="overview">Job Listings</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="profile">Company Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Job Listings</CardTitle>
                  <CardDescription>
                    Manage your posted jobs and view applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  ) : jobs && jobs.length > 0 ? (
                    <div className="space-y-6">
                      {jobs.map((job) => (
                        <div
                          key={job._id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {job.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Budget: {job.budget} • Deadline: {job.deadline}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {job.skillsRequired &&
                                  job.skillsRequired.map((skill, index) => (
                                    <Badge key={index} variant="secondary">
                                      {skill}
                                    </Badge>
                                  ))}
                              </div>
                            </div>
                            <Badge
                              variant={
                                job.status === "active"
                                  ? "success"
                                  : job.status === "completed"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {job.status}
                            </Badge>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              <span>Applications: {job.applications?.length || 0}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Link href={`/jobs/${job._id}`}>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </Link>
                              <Link href={`/jobs/${job._id}/edit`}>
                                <Button size="sm" variant="outline">
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this job?")) {
                                    deleteJobMutation.mutate(job._id);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">
                        You haven't posted any jobs yet
                      </p>
                      <Link href="/post-job">
                        <Button>Post Your First Job</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Applicant Management</CardTitle>
                  <CardDescription>
                    Review and manage applications for your job listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-40 w-full" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ) : jobs && jobs.length > 0 ? (
                    <div className="space-y-8">
                      {jobs.filter(job => job.applications?.length > 0).map((job) => {
                        // Using the job applications hook inside the map function is safe
                        const { data: applications, isLoading } = useJobApplications(job._id);
                        
                        return (
                          <div key={job._id}>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                              {job.title} ({job.applications?.length} applications)
                            </h3>
                            
                            {isLoading ? (
                              <div className="space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                              </div>
                            ) : applications && applications.length > 0 ? (
                              <div className="space-y-4">
                                {applications.map((application) => (
                                  <div
                                    key={application._id}
                                    className="border border-gray-200 rounded-lg p-4"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium text-gray-900">
                                          {application.freelancerId.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                          {application.freelancerId.skills?.join(", ")}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                          Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <Badge
                                        variant={
                                          application.status === "accepted"
                                            ? "success"
                                            : application.status === "rejected"
                                            ? "destructive"
                                            : "secondary"
                                        }
                                      >
                                        {application.status}
                                      </Badge>
                                    </div>
                                    
                                    {application.coverLetter && (
                                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                        <p className="text-sm text-gray-700">
                                          {application.coverLetter}
                                        </p>
                                      </div>
                                    )}
                                    
                                    {application.status === "pending" && (
                                      <div className="mt-4 flex justify-end space-x-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="bg-green-100 text-green-800 hover:bg-green-200"
                                          onClick={() =>
                                            updateApplicationMutation.mutate({
                                              applicationId: application._id,
                                              status: "accepted",
                                            })
                                          }
                                        >
                                          Accept
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="bg-red-100 text-red-800 hover:bg-red-200"
                                          onClick={() =>
                                            updateApplicationMutation.mutate({
                                              applicationId: application._id,
                                              status: "rejected",
                                            })
                                          }
                                        >
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">No applications for this job yet</p>
                            )}
                          </div>
                        );
                      })}
                      
                      {jobs.filter(job => job.applications?.length > 0).length === 0 && (
                        <div className="text-center py-6">
                          <p className="text-gray-500">
                            No applications received yet for any of your jobs
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">
                        You haven't posted any jobs yet
                      </p>
                      <Link href="/post-job">
                        <Button>Post Your First Job</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Profile</CardTitle>
                  <CardDescription>
                    Manage your company information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Company Name</h4>
                        <p className="text-gray-900">{profile?.company || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Name</h4>
                        <p className="text-gray-900">{profile?.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Location</h4>
                        <p className="text-gray-900">{profile?.location || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                        <p className="text-gray-900">{profile?.experience || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">About</h4>
                        <p className="text-gray-900">{profile?.bio || "No bio added yet"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Statistics</h4>
                        <ul className="list-disc list-inside text-gray-700 mt-2">
                          <li>Total Job Listings: {profile?.totalListings || 0}</li>
                          <li>Successful Hires: {profile?.successfulHires || 0}</li>
                        </ul>
                      </div>
                      <Link href="/profile">
                        <Button variant="outline" className="w-full mt-4">
                          Edit Company Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
