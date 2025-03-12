import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/common/footer";
import { motion } from "framer-motion";
import JobCard from "@/components/job/job-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SearchIcon, FilterIcon } from "lucide-react";

export default function JobListings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // All jobs query
  const {
    data: jobs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/jobs"],
    refetchOnWindowFocus: false,
  });

  // Skills list for filters
  const allSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "JavaScript",
    "TypeScript",
    "UI/UX",
    "Design",
    "Marketing",
    "Content Writing",
    "SEO",
  ];

  // Locations list for filters
  const allLocations = [
    "Remote",
    "United States",
    "Europe",
    "Asia",
    "United Kingdom",
    "Canada",
  ];

  // Handle skill checkbox change
  const handleSkillChange = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  // Handle location checkbox change
  const handleLocationChange = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  // Filter jobs based on search query and selected filters
  const filteredJobs = jobs
    ? jobs.filter((job) => {
        // Search query filter
        const matchesSearch =
          searchQuery === "" ||
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.description &&
            job.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Skills filter
        const matchesSkills =
          selectedSkills.length === 0 ||
          (job.skillsRequired &&
            job.skillsRequired.some((skill) => selectedSkills.includes(skill)));

        // Location filter
        const matchesLocation =
          selectedLocations.length === 0 ||
          (job.location &&
            selectedLocations.some((loc) =>
              job.location.toLowerCase().includes(loc.toLowerCase())
            )) ||
          (selectedLocations.includes("Remote") &&
            job.location.toLowerCase().includes("remote"));

        return matchesSearch && matchesSkills && matchesLocation;
      })
    : [];

  // Apply filters
  const applyFilters = () => {
    refetch();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSkills([]);
    setSelectedLocations([]);
    refetch();
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
            <p className="text-gray-600 mt-2">
              Find the perfect project that matches your skills and interests
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters (desktop) */}
            <Card className="hidden lg:block">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Refine your job search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Skills</h3>
                  <div className="space-y-2">
                    {allSkills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => handleSkillChange(skill)}
                        />
                        <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-3">Location</h3>
                  <div className="space-y-2">
                    {allLocations.map((location) => (
                      <div
                        key={location}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`location-${location}`}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={() => handleLocationChange(location)}
                        />
                        <Label htmlFor={`location-${location}`}>
                          {location}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 pt-2">
                  <Button onClick={applyFilters}>Apply Filters</Button>
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job listings */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search bar */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search jobs by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={applyFilters}>Search</Button>
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Mobile filters */}
              {showFilters && (
                <Card className="lg:hidden">
                  <CardHeader>
                    <CardTitle>Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Skills</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {allSkills.map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`mobile-skill-${skill}`}
                              checked={selectedSkills.includes(skill)}
                              onCheckedChange={() => handleSkillChange(skill)}
                            />
                            <Label htmlFor={`mobile-skill-${skill}`}>
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-3">Location</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {allLocations.map((location) => (
                          <div
                            key={location}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`mobile-location-${location}`}
                              checked={selectedLocations.includes(location)}
                              onCheckedChange={() =>
                                handleLocationChange(location)
                              }
                            />
                            <Label htmlFor={`mobile-location-${location}`}>
                              {location}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        onClick={() => {
                          applyFilters();
                          setShowFilters(false);
                        }}
                        className="flex-1"
                      >
                        Apply Filters
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          clearFilters();
                          setShowFilters(false);
                        }}
                        className="flex-1"
                      >
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active filters */}
              {(selectedSkills.length > 0 || selectedLocations.length > 0) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-gray-500">Active filters:</span>
                  {selectedSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <button
                        onClick={() => handleSkillChange(skill)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {selectedLocations.map((location) => (
                    <Badge
                      key={location}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {location}
                      <button
                        onClick={() => handleLocationChange(location)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-7 text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Results count */}
              <div>
                <p className="text-sm text-gray-500">
                  {isLoading
                    ? "Loading jobs..."
                    : `Showing ${filteredJobs.length} ${
                        filteredJobs.length === 1 ? "job" : "jobs"
                      }`}
                </p>
              </div>

              {/* Job listings */}
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-48 w-full" />
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredJobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search filters or check back later for new
                    opportunities.
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
