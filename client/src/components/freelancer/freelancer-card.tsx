import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type FreelancerCardProps = {
  freelancer: any;
};

export default function FreelancerCard({ freelancer }: FreelancerCardProps) {
  // Function to get the initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <svg key="half" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <Avatar className="w-20 h-20 mb-4">
          <AvatarFallback className="bg-primary text-white">
            {getInitials(freelancer.name)}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="text-lg font-semibold text-gray-900">{freelancer.name}</h3>
        <p className="text-primary font-medium">
          {freelancer.skills && freelancer.skills.length > 0 
            ? freelancer.skills[0] 
            : "Freelancer"}
        </p>
        
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {renderStars(freelancer.rating || 4.5)}
          </div>
          <span className="ml-1 text-sm text-gray-600">{freelancer.rating || "4.5"}</span>
        </div>
        
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {freelancer.bio || "Experienced professional with expertise in various domains."}
        </p>
        
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {freelancer.skills && freelancer.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-primary px-2 py-1 text-xs font-medium rounded">
              {skill}
            </Badge>
          ))}
        </div>
        
        <Link href={`/freelancers/${freelancer.id}`}>
          <Button className="mt-5 w-full bg-primary hover:bg-blue-600 text-white">
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
