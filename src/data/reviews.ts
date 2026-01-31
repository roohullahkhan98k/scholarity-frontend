export interface Review {
    id: string;
    studentName: string;
    teacherName: string;
    rating: number;
    comment: string;
    date: string;
    avatarUrl: string;
}

export const reviews: Review[] = [
    {
        id: '1',
        studentName: "Alex Thompson",
        teacherName: "Sarah Jenkins",
        rating: 5,
        comment: "Sarah explains complex calculus concepts in a way that just makes sense. My grades have improved significantly!",
        date: "2 days ago",
        avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
        id: '2',
        studentName: "Maria Garcia",
        teacherName: "David Chen",
        rating: 5,
        comment: "David is incredibly patient. He helped me prepare for my finals and I felt so much more confident.",
        date: "1 week ago",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
        id: '3',
        studentName: "James Wilson",
        teacherName: "Michael Chang",
        rating: 4,
        comment: "Great coding sessions. We built a real project together which was super helpful for my portfolio.",
        date: "3 weeks ago",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100"
    }
];
