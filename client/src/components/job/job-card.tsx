import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

type JobCardProps = {
  job: any;
  showActions?: boolean;
};

export default function JobCard({ job, showActions = true }: JobCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/jobs/${job._id}/apply`, {
        coverLetter: `I'm interested in the ${job.title} position.`
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: "Your application has been sent to the recruiter."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error applying",
        description: error.message || "There was an error submitting your application.",
        variant: "destructive"
      });
    }
  });

  const getPostedTime = (createdAt) => {
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    } catch (e) {
      return "recently";
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary transition">
              <Link href={`/jobs/${job._id}`}>{job.title}</Link>
            </h3>
            <p className="text-sm text-gray-500 mt-1">{job.company} • {job.location || "Remote"}</p>
          </div>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1 text-xs font-medium rounded">
            {job.budget}
          </Badge>
        </div>
        
        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
          {job.description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skillsRequired && job.skillsRequired.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-primary px-2 py-1 text-xs font-medium rounded">
              {skill}
            </Badge>
          ))}
        </div>
        
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{job.createdAt ? getPostedTime(job.createdAt) : "Recently posted"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Due: {job.deadline}</span>
          </div>
        </div>
        
        {showActions && (
          user?.role === "freelancer" ? (
            <Button 
              className="mt-5 w-full bg-primary hover:bg-blue-600 text-white"
              onClick={() => applyMutation.mutate()}
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? "Applying..." : "Apply Now"}
            </Button>
          ) : (
            <Link href={`/jobs/${job._id}`}>
              <Button className="mt-5 w-full bg-primary hover:bg-blue-600 text-white">
                View Details
              </Button>
            </Link>
          )
        )}
      </CardContent>
    </Card>
  );
}
