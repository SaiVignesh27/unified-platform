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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function FreelancerDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Get user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/auth/profile"],
    refetchOnWindowFocus: false,
  });

  // Get user applications
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/freelancers/applications/my"],
    refetchOnWindowFocus: false,
  });

  // Get user's active jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs/dashboard/myjobs"],
    refetchOnWindowFocus: false,
  });

  // Update project progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ projectId, progress }: { projectId: string; progress: number }) => {
      const res = await apiRequest("PUT", `/api/freelancers/projects/${projectId}`, {
        progress,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Progress updated",
        description: "Project progress has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Group applications by status
  const pendingApplications = applications?.filter(app => app.status === 'pending') || [];
  const acceptedApplications = applications?.filter(app => app.status === 'accepted') || [];
  const rejectedApplications = applications?.filter(app => app.status === 'rejected') || [];

  // Calculate stats
  const totalEarnings = profile?.totalEarnings || "$0";
  const hoursWorked = profile?.hoursWorked || 0;
  const activeProjects = profile?.activeProjects?.length || 0;

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
              Freelancer Dashboard
            </motion.h1>
            <motion.p
              className="text-gray-600 mt-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Manage your freelance business, track projects, and find new opportunities
            </motion.p>
          </div>

          {profileLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalEarnings}</h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hours Worked</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{hoursWorked} hrs</h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Projects</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeProjects}</h3>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="bg-white border border-gray-200 rounded-lg p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="projects">Active Projects</TabsTrigger>
              <TabsTrigger value="recommendations">Recommended Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Overview</CardTitle>
                    <CardDescription>
                      Your profile information and skills
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
                          <h4 className="text-sm font-medium text-gray-500">Name</h4>
                          <p className="text-gray-900">{profile?.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Location</h4>
                          <p className="text-gray-900">{profile?.location || "Not specified"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                          <p className="text-gray-900">{profile?.bio || "No bio added yet"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Skills</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {profile?.skills && profile.skills.length > 0 ? (
                              profile.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">
                                  {skill}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No skills added yet</p>
                            )}
                          </div>
                        </div>
                        <Link href="/profile">
                          <Button variant="outline" className="w-full mt-4">
                            Edit Profile
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Latest Applications</CardTitle>
                    <CardDescription>
                      Your recent job applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {applicationsLoading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : applications && applications.length > 0 ? (
                      <div className="space-y-4">
                        {applications.slice(0, 3).map((application) => (
                          <div
                            key={application._id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {application.jobId.title}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {application.jobId.company}
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
                          </div>
                        ))}
                        <Link href="#" onClick={() => setActiveTab("applications")}>
                          <Button variant="ghost" className="w-full">
                            View All Applications
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">
                          You haven't applied to any jobs yet
                        </p>
                        <Link href="/jobs">
                          <Button>Browse Jobs</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Applications</CardTitle>
                  <CardDescription>
                    Track the status of your job applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : applications && applications.length > 0 ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Pending Applications ({pendingApplications.length})</h3>
                        <div className="space-y-4">
                          {pendingApplications.length > 0 ? (
                            pendingApplications.map((application) => (
                              <div
                                key={application._id}
                                className="border border-gray-200 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {application.jobId.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {application.jobId.company} • Budget: {application.jobId.budget}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                      Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge variant="secondary">Pending</Badge>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No pending applications</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Accepted Applications ({acceptedApplications.length})</h3>
                        <div className="space-y-4">
                          {acceptedApplications.length > 0 ? (
                            acceptedApplications.map((application) => (
                              <div
                                key={application._id}
                                className="border border-gray-200 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {application.jobId.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {application.jobId.company} • Budget: {application.jobId.budget}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                      Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No accepted applications</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Rejected Applications ({rejectedApplications.length})</h3>
                        <div className="space-y-4">
                          {rejectedApplications.length > 0 ? (
                            rejectedApplications.map((application) => (
                              <div
                                key={application._id}
                                className="border border-gray-200 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {application.jobId.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {application.jobId.company} • Budget: {application.jobId.budget}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                      Applied: {new Date(application.appliedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge variant="destructive">Rejected</Badge>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No rejected applications</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">
                        You haven't applied to any jobs yet
                      </p>
                      <Link href="/jobs">
                        <Button>Browse Jobs</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>
                    Manage your ongoing projects and track progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-40 w-full" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ) : profile?.activeProjects && profile.activeProjects.length > 0 ? (
                    <div className="space-y-6">
                      {profile.activeProjects.map((project) => (
                        <div
                          key={project.id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {project.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Client: {project.client}
                              </p>
                            </div>
                            <Badge
                              variant={
                                project.status === "Completed"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-500">Progress</span>
                              <span className="text-sm font-medium text-gray-900">
                                {project.progress}%
                              </span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              <span>Due: {project.dueDate}</span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateProgressMutation.mutate({
                                    projectId: project.id.toString(),
                                    progress: Math.min(project.progress + 10, 100),
                                  })
                                }
                                disabled={
                                  project.progress >= 100 ||
                                  updateProgressMutation.isPending
                                }
                              >
                                Update Progress
                              </Button>
                              {project.progress === 100 && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 hover:bg-green-200"
                                >
                                  Completed
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">
                        You don't have any active projects
                      </p>
                      <Link href="/jobs">
                        <Button>Find Projects</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Jobs</CardTitle>
                  <CardDescription>
                    Jobs that match your skills and experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profileLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  ) : profile?.recommendedJobs && profile.recommendedJobs.length > 0 ? (
                    <div className="space-y-4">
                      {profile.recommendedJobs.map((job) => (
                        <div
                          key={job.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {job.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {job.company} • {job.salary}
                              </p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              {job.match} match
                            </Badge>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {job.skills.map((skill, index) => (
                              <Badge key={index} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-4">
                            <Button className="w-full">View Job</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 mb-4">
                        No recommended jobs yet. Update your profile to get personalized recommendations.
                      </p>
                      <Link href="/profile">
                        <Button>Update Profile</Button>
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
