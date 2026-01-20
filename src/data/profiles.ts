import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";
import profile4 from "@/assets/profile-4.jpg";
import profile5 from "@/assets/profile-5.jpg";
import profile6 from "@/assets/profile-6.jpg";

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  neighborhood: string;
  budget: number;
  moveIn: string;
  bio: string;
  occupation: string;
  image: string;
  images: string[];
  traits: {
    pets: boolean;
    petsOk: boolean;
    drinks: "never" | "socially" | "regularly";
    smokes: "never" | "socially" | "regularly";
    nightOwl: boolean;
    clean: "relaxed" | "moderate" | "clean" | "very-clean";
    personality: "introvert" | "ambivert" | "extrovert";
    guests: "rarely" | "sometimes" | "often";
    workFromHome: boolean;
  };
  interests: string[];
  compatibility: number;
}

export const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Emma",
    age: 26,
    location: "Brooklyn, NY",
    neighborhood: "Williamsburg",
    budget: 1200,
    moveIn: "ASAP",
    bio: "Marketing professional who loves cooking, yoga, and quiet Sunday mornings. Looking for a chill roommate who respects shared spaces!",
    occupation: "Marketing Manager",
    image: profile1,
    images: [profile1],
    traits: {
      pets: false,
      petsOk: true,
      drinks: "socially",
      smokes: "never",
      nightOwl: false,
      clean: "very-clean",
      personality: "ambivert",
      guests: "sometimes",
      workFromHome: true,
    },
    interests: ["Yoga", "Cooking", "Reading", "Hiking"],
    compatibility: 95,
  },
  {
    id: "2",
    name: "James",
    age: 28,
    location: "Manhattan, NY",
    neighborhood: "East Village",
    budget: 1500,
    moveIn: "1 month",
    bio: "Software engineer, coffee enthusiast, and weekend hiker. Early riser who respects quiet hours. Looking for someone laid-back!",
    occupation: "Software Engineer",
    image: profile2,
    images: [profile2],
    traits: {
      pets: false,
      petsOk: false,
      drinks: "socially",
      smokes: "never",
      nightOwl: false,
      clean: "clean",
      personality: "introvert",
      guests: "rarely",
      workFromHome: true,
    },
    interests: ["Coding", "Coffee", "Hiking", "Gaming"],
    compatibility: 88,
  },
  {
    id: "3",
    name: "Maya",
    age: 24,
    location: "Queens, NY",
    neighborhood: "Astoria",
    budget: 1000,
    moveIn: "Flexible",
    bio: "Grad student studying architecture. Plant mom, night owl, and amazing at keeping shared spaces tidy. Love a good Netflix binge!",
    occupation: "Graduate Student",
    image: profile3,
    images: [profile3],
    traits: {
      pets: true,
      petsOk: true,
      drinks: "never",
      smokes: "never",
      nightOwl: true,
      clean: "very-clean",
      personality: "introvert",
      guests: "rarely",
      workFromHome: true,
    },
    interests: ["Architecture", "Plants", "Art", "Movies"],
    compatibility: 92,
  },
  {
    id: "4",
    name: "Kevin",
    age: 27,
    location: "Brooklyn, NY",
    neighborhood: "Park Slope",
    budget: 1300,
    moveIn: "2-3 months",
    bio: "UX designer who loves board games, cooking elaborate meals, and spontaneous adventures. Clean freak but very friendly!",
    occupation: "UX Designer",
    image: profile4,
    images: [profile4],
    traits: {
      pets: false,
      petsOk: true,
      drinks: "socially",
      smokes: "never",
      nightOwl: false,
      clean: "very-clean",
      personality: "extrovert",
      guests: "often",
      workFromHome: true,
    },
    interests: ["Design", "Cooking", "Board Games", "Travel"],
    compatibility: 85,
  },
  {
    id: "5",
    name: "Aisha",
    age: 25,
    location: "Manhattan, NY",
    neighborhood: "Harlem",
    budget: 1100,
    moveIn: "ASAP",
    bio: "Nurse working night shifts. Looking for a quiet place to sleep during the day. Love plants, podcasts, and peaceful vibes.",
    occupation: "Registered Nurse",
    image: profile5,
    images: [profile5],
    traits: {
      pets: true,
      petsOk: true,
      drinks: "never",
      smokes: "never",
      nightOwl: true,
      clean: "clean",
      personality: "ambivert",
      guests: "sometimes",
      workFromHome: false,
    },
    interests: ["Plants", "Podcasts", "Fitness", "Cooking"],
    compatibility: 90,
  },
  {
    id: "6",
    name: "Carlos",
    age: 29,
    location: "Brooklyn, NY",
    neighborhood: "Bushwick",
    budget: 950,
    moveIn: "1 month",
    bio: "Musician and bartender with a flexible schedule. Respectful of quiet hours and shared spaces. Always down for a good chat!",
    occupation: "Musician / Bartender",
    image: profile6,
    images: [profile6],
    traits: {
      pets: false,
      petsOk: true,
      drinks: "socially",
      smokes: "socially",
      nightOwl: true,
      clean: "moderate",
      personality: "extrovert",
      guests: "often",
      workFromHome: false,
    },
    interests: ["Music", "Art", "Cooking", "Nightlife"],
    compatibility: 78,
  },
];
