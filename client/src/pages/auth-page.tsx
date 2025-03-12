import { useState, useEffect } from "react";
import { useLocation, useRoute, useSearch, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/common/footer";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  role: z.enum(["freelancer", "recruiter"], {
    required_error: "Please select a role",
  }),
  company: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const { user, loginMutation, registerMutation } = useAuth();

  // If tab is passed in URL query params, use it
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && (tabParam === "login" || tabParam === "signup")) {
      setActiveTab(tabParam);
    }
    
    // Get role from URL if provided
    const roleParam = searchParams.get("role");
    if (roleParam && registerForm.getValues("role") !== roleParam) {
      registerForm.setValue("role", roleParam as "freelancer" | "recruiter");
    }
  }, [search]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "freelancer",
      company: "",
    },
  });

  // Form submission handlers
  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({
      username: values.username,
      password: values.password,
    });
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
      company: values.company,
    });
  };

  // Watch the role field to show/hide company field
  const role = registerForm.watch("role");

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Form Column */}
              <div className="p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                      <div className="space-y-4">
                        <div className="text-center mb-8">
                          <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back to FreelanceHub
                          </h1>
                          <p className="mt-2 text-gray-600">
                            Enter your credentials to access your account
                          </p>
                        </div>

                        <Form {...loginForm}>
                          <form
                            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="your@email.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="••••••••"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input
                                  id="remember-me"
                                  name="remember-me"
                                  type="checkbox"
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label
                                  htmlFor="remember-me"
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  Remember me
                                </label>
                              </div>
                              <div className="text-sm">
                                <a
                                  href="#"
                                  className="text-primary hover:text-blue-700"
                                >
                                  Forgot password?
                                </a>
                              </div>
                            </div>

                            <Button
                              type="submit"
                              className="w-full"
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Logging in...
                                </>
                              ) : (
                                "Login"
                              )}
                            </Button>
                          </form>
                        </Form>

                        <div className="mt-6">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <Separator />
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-white text-gray-500">
                                Don't have an account?
                              </span>
                            </div>
                          </div>
                          <div className="mt-6 text-center">
                            <button
                              onClick={() => setActiveTab("signup")}
                              className="text-primary hover:text-blue-700 font-medium"
                            >
                              Sign up for FreelanceHub
                            </button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="signup">
                      <div className="space-y-4">
                        <div className="text-center mb-8">
                          <h1 className="text-2xl font-bold text-gray-900">
                            Create your FreelanceHub account
                          </h1>
                          <p className="mt-2 text-gray-600">
                            Join our community of freelancers and recruiters
                          </p>
                        </div>

                        <Form {...registerForm}>
                          <form
                            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={registerForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="John Doe"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="your@email.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="••••••••"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      placeholder="••••••••"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={registerForm.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>I am a:</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="grid grid-cols-2 gap-4"
                                    >
                                      <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:border-primary hover:bg-blue-50 cursor-pointer">
                                        <RadioGroupItem
                                          value="freelancer"
                                          id="freelancer"
                                          className="sr-only"
                                        />
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-primary mb-2"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                          />
                                        </svg>
                                        <label
                                          htmlFor="freelancer"
                                          className="text-gray-900 font-medium"
                                        >
                                          Freelancer
                                        </label>
                                      </div>
                                      <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-md hover:border-primary hover:bg-blue-50 cursor-pointer">
                                        <RadioGroupItem
                                          value="recruiter"
                                          id="recruiter"
                                          className="sr-only"
                                        />
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-primary mb-2"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                          />
                                        </svg>
                                        <label
                                          htmlFor="recruiter"
                                          className="text-gray-900 font-medium"
                                        >
                                          Recruiter
                                        </label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {role === "recruiter" && (
                              <FormField
                                control={registerForm.control}
                                name="company"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your Company"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            <div className="flex items-center">
                              <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              />
                              <label
                                htmlFor="terms"
                                className="ml-2 block text-sm text-gray-700"
                              >
                                I agree to the{" "}
                                <a
                                  href="#"
                                  className="text-primary hover:text-blue-700"
                                >
                                  Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                  href="#"
                                  className="text-primary hover:text-blue-700"
                                >
                                  Privacy Policy
                                </a>
                              </label>
                            </div>

                            <Button
                              type="submit"
                              className="w-full"
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Creating Account...
                                </>
                              ) : (
                                "Create Account"
                              )}
                            </Button>
                          </form>
                        </Form>

                        <div className="mt-6">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <Separator />
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-white text-gray-500">
                                Already have an account?
                              </span>
                            </div>
                          </div>
                          <div className="mt-6 text-center">
                            <button
                              onClick={() => setActiveTab("login")}
                              className="text-primary hover:text-blue-700 font-medium"
                            >
                              Log in to your account
                            </button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              </div>

              {/* Hero Column */}
              <div className="hidden md:block bg-gradient-to-br from-blue-500 to-indigo-600 p-12 text-white">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full flex flex-col justify-center"
                >
                  <h2 className="text-3xl font-bold mb-6">
                    Connect With Top Talent & Exciting Projects
                  </h2>
                  <p className="mb-8 text-blue-100">
                    FreelanceHub brings together skilled professionals and
                    businesses looking for talent. Whether you're a freelancer
                    looking for your next gig or a recruiter searching for the
                    perfect match, we've got you covered.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">
                          Specialized Talent
                        </h3>
                        <p className="text-sm text-blue-100">
                          Find professionals with specific skills for your
                          project needs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">
                          Seamless Hiring
                        </h3>
                        <p className="text-sm text-blue-100">
                          Streamlined process from job posting to hiring
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold">
                          Verified Profiles
                        </h3>
                        <p className="text-sm text-blue-100">
                          Quality talent with verified skills and experience
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
