export interface Teacher {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  hourlyRate: number;
}

export const teachers: Teacher[] = [
  {
    id: '1',
    name: "Sarah Jenkins",
    subject: "Advanced Mathematics",
    rating: 4.9,
    reviewCount: 128,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
    hourlyRate: 45
  },
  {
    id: '2',
    name: "David Chen",
    subject: "Physics & Chemistry",
    rating: 4.8,
    reviewCount: 95,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400",
    hourlyRate: 50
  },
  {
    id: '3',
    name: "Emily Rodriguez",
    subject: "English Literature",
    rating: 5.0,
    reviewCount: 210,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
    hourlyRate: 35
  },
  {
    id: '4',
    name: "Michael Chang",
    subject: "Computer Science",
    rating: 4.7,
    reviewCount: 84,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
    hourlyRate: 60
  }
];
