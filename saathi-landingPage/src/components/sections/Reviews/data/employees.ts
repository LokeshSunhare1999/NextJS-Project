export interface Employee {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

export const employees: Employee[] = [
  {
    id: 1,
    name: "Rajan",
    role: "Security Guard",
    company: "zomato",
    image: "/testimonials/raj.jpg",
    quote: "The user interface is intuitive and user-friendly. Even for someone like me, who isn't a professional photographer,",
  },
  {
    id: 2,
    name: "Uma kumari",
    role: "House Maid",
    company: "Camellias",
    image: "/testimonials/uma.jpg",
    quote: "It was a pleasure working the headshot team they understood the brief correctly and delivered great design exceeding the expectations.",
  },
  {
    id: 3,
    name: "Shoyab Masnsori",
    role: "Driver",
    company: "Make My Trip",
    image: "/testimonials/charlotte.jpg",
    quote: "The variety of styles and effects available is mind-blowing. I experimented with landscape portraits, and even some everyday shots.",
  },
  {
    id: 4,
    name: "Sanjay",
    role: "Office Boy",
    company: "Microsoft",
    image: "/testimonials/james.jpg",
    quote: "I recently tried out and I am utterly amazed at the artistic brilliance it brings to the table. This tool is a game-changer for anyone",
  },
  {
    id: 5,
    name: "Sangeeta",
    role: "Beautician",
    company: "Loreal",
    image: "/testimonials/william.jpg",
    quote: "One feature that stood out to me was the customization options. allows you to fine-tune the level of artistic expression",
  },
]; 