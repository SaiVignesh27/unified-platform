import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/common/footer";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, User, Building, MapPin, Briefcase, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Define form schema based on role
const freelancerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
});

const recruiterSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().optional(),
});

type FreelancerFormValues = z.infer<typeof freelancerSchema>;
type RecruiterFormValues = z.infer<typeof recruiterSchema>;

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  // Get user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/auth/profile"],
    refetchOnWindowFocus: false,
  });

  // Prepare default values for the form
  const prepareFreelancerDefaults = () => {
    return {
      name: profile?.name || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
      skills: profile?.skills ? profile.skills.join(", ") : "",
    };
  };

  const prepareRecruiterDefaults = () => {
    return {
      name: profile?.name || "",
      company: profile?.company || "",
      location: profile?.location || "",
      experience: profile?.experience || "",
      bio: profile?.bio || "",
    };
  };

  // Setup the right form based on user role
  const freelancerForm = useForm<FreelancerFormValues>({
    resolver: zodResolver(freelancerSchema),
    defaultValues: profileLoading ? {
      name: "",
      location: "",
      bio: "",
      skills: "",
    } : prepareFreelancerDefaults(),
  });

  const recruiterForm = useForm<RecruiterFormValues>({
    resolver: zodResolver(recruiterSchema),
    defaultValues: profileLoading ? {
      name: "",
      company: "",
      location: "",
      experience: "",
      bio: "",
    } : prepareRecruiterDefaults(),
  });

  // Update form values when profile data loads
  useEffect(() => {
    if (!profileLoading && profile) {
      if (user?.role === "freelancer") {
        freelancerForm.reset(prepareFreelancerDefaults());
      } else if (user?.role === "recruiter") {
        recruiterForm.reset(prepareRecruiterDefaults());
      }
    }
  }, [profile, profileLoading, user?.role]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: FreelancerFormValues | RecruiterFormValues) => {
      // For freelancers, convert comma-separated skills string to array
      if (user?.role === "freelancer" && "skills" in data) {
        const formData = data as FreelancerFormValues;
        const skillsArray = formData.skills
          ? formData.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
          : [];
        
        const freelancerData = {
          ...formData,
          skills: skillsArray,
        };

        const response = await apiRequest("PUT", "/api/freelancers/profile", freelancerData);
        return await response.json();
      } else {
        // For recruiters
        const response = await apiRequest("PUT", "/api/recruiters/profile", data);
        return await response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onFreelancerSubmit = (data: FreelancerFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const onRecruiterSubmit = (data: RecruiterFormValues) => {
    updateProfileMutation.mutate(data);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your personal information and customize your profile
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  {profileLoading ? (
                    <Skeleton className="w-24 h-24 rounded-full" />
                  ) : (
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-xl bg-primary text-white">
                        {profile?.name ? getInitials(profile.name) : user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="mt-4 text-center">
                    {profileLoading ? (
                      <>
                        <Skeleton className="h-6 w-32 mx-auto mb-2" />
                        <Skeleton className="h-4 w-24 mx-auto" />
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold text-gray-900">{profile?.name}</h2>
                        <p className="text-primary">{user.role === "freelancer" ? "Freelancer" : "Recruiter"}</p>
                      </>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  {profileLoading ? (
                    <>
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      {user.role === "freelancer" && <Skeleton className="h-5 w-full" />}
                      {user.role === "recruiter" && <Skeleton className="h-5 w-full" />}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-500">
                        <User className="w-5 h-5 mr-2" />
                        <span>{profile?.name || "Not specified"}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{profile?.location || "Not specified"}</span>
                      </div>
                      {user.role === "freelancer" && (
                        <div className="flex items-start text-gray-500">
                          <Briefcase className="w-5 h-5 mr-2 mt-0.5" />
                          <span>
                            {profile?.skills && profile.skills.length > 0
                              ? profile.skills.join(", ")
                              : "No skills added yet"}
                          </span>
                        </div>
                      )}
                      {user.role === "recruiter" && (
                        <div className="flex items-center text-gray-500">
                          <Building className="w-5 h-5 mr-2" />
                          <span>{profile?.company || "Not specified"}</span>
                        </div>
                      )}
                      <div className="flex items-start text-gray-500">
                        <FileText className="w-5 h-5 mr-2 mt-0.5" />
                        <span className="line-clamp-3">{profile?.bio || "No bio added yet"}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Update your personal information and improve your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.role === "freelancer" ? (
                  <Form {...freelancerForm}>
                    <form
                      onSubmit={freelancerForm.handleSubmit(onFreelancerSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={freelancerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={freelancerForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="New York, USA" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your current location helps you find nearby opportunities
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={freelancerForm.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="React, Node.js, MongoDB (comma-separated)"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              List your key skills, separated by commas
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={freelancerForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell potential clients about yourself, your experience, and expertise..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A compelling bio helps you stand out to potential clients
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating Profile...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...recruiterForm}>
                    <form
                      onSubmit={recruiterForm.handleSubmit(onRecruiterSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={recruiterForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={recruiterForm.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="TechCorp" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={recruiterForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco, USA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={recruiterForm.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience</FormLabel>
                            <FormControl>
                              <Input placeholder="10+ years in recruitment" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your experience in the industry or recruiting field
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={recruiterForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About Company</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell freelancers about your company and what you're looking for..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A detailed company description helps attract the right talent
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating Profile...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
