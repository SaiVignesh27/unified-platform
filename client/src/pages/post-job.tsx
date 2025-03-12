import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/common/footer";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

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
import { Loader2 } from "lucide-react";

// Form schema for job posting
const jobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  skillsRequired: z.string().min(2, "At least one skill is required"),
  budget: z.string().min(2, "Budget is required"),
  deadline: z.string().min(2, "Deadline is required"),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function PostJob() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user is a recruiter
  if (user && user.role !== "recruiter") {
    setLocation("/");
    toast({
      title: "Access Denied",
      description: "Only recruiters can post jobs",
      variant: "destructive",
    });
  }

  // Form initialization
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      company: "",
      location: "",
      skillsRequired: "",
      budget: "",
      deadline: "",
    },
  });

  // Post job mutation
  const postJobMutation = useMutation({
    mutationFn: async (data: JobFormValues) => {
      // Convert comma-separated skills string to array
      const skillsArray = data.skillsRequired
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const jobData = {
        ...data,
        skillsRequired: skillsArray,
      };

      const response = await apiRequest("POST", "/api/jobs", jobData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Posted",
        description: "Your job has been successfully posted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recruiters/jobs/my"] });
      setLocation("/recruiter/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post job",
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: JobFormValues) => {
    postJobMutation.mutate(data);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
            <p className="text-gray-600 mt-2">
              Connect with talented freelancers to bring your project to life
            </p>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide comprehensive information to attract the right
                candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Full-Stack Developer for E-commerce Website"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A clear title will attract more relevant freelancers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Company Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the project, responsibilities, and requirements in detail..."
                            className="h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about deliverables, technology stack, and expectations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Remote, New York, USA"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. $1000, $50-100/hr"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="skillsRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. React, Node.js, MongoDB (comma-separated)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List the key skills needed, separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. MM/DD/YYYY or in 2 weeks"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          When do you need this project completed?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={postJobMutation.isPending}
                  >
                    {postJobMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting Job...
                      </>
                    ) : (
                      "Post Job"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
