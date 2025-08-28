export interface employers {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
}

export const employers: employers[] = [
  {
    id: 1,
    name: "Ashish",
    role: "HR",
    company: "Genpack",
    image: "/testimonials/mateo.jpg",
    quote: "The user interface is intuitive and user-friendly. Even for someone like me, who isn't a professional photographer,",
  },
  {
    id: 2,
    name: "Shobhit",
    role: "HR Executive",
    company: "Shopify",
    image: "/testimonials/olivia.jpg",
    quote: "It was a pleasure working the headshot team they understood the brief correctly and delivered great design exceeding the expectations.",
  },
  {
    id: 3,
    name: "Chandan",
    role: "Manager",
    company: "Casper",
    image: "/testimonials/charlotte.jpg",
    quote: "The variety of styles and effects available is mind-blowing. I experimented with landscape portraits, and even some everyday shots.",
  },
  {
    id: 4,
    name: "James",
    role: "Shippment Manager",
    company: "Blue Dart",
    image: "/testimonials/james.jpg",
    quote: "I recently tried out and I am utterly amazed at the artistic brilliance it brings to the table. This tool is a game-changer for anyone",
  },
  {
    id: 5,
    name: "Vansh",
    role: "Delivery Manager",
    company: "Flipkart",
    image: "/testimonials/william.jpg",
    quote: "One feature that stood out to me was the customization options. allows you to fine-tune the level of artistic expression",
  },
]; 