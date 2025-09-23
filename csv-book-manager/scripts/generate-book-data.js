// Script to generate 10,000+ sample book records
import { writeFileSync } from "fs"

// Sample data arrays for generating realistic book data
const titles = [
  "The Silent Observer",
  "Midnight Chronicles",
  "Digital Horizons",
  "The Last Symphony",
  "Quantum Dreams",
  "Shadow's Edge",
  "The Forgotten Path",
  "Crimson Tide",
  "Eternal Echoes",
  "The Glass Tower",
  "Whispers in Time",
  "The Iron Crown",
  "Celestial Voyage",
  "Dark Waters",
  "The Phoenix Rising",
  "Broken Chains",
  "The Silver Key",
  "Infinite Loops",
  "The Golden Hour",
  "Storm's End",
  "The Crystal Cave",
  "Neon Nights",
  "The Marble Garden",
  "Electric Dreams",
  "The Copper Bridge",
  "Velvet Shadows",
  "The Diamond Mind",
  "Frozen Moments",
  "The Ruby Heart",
  "Sapphire Skies",
  "The Emerald Forest",
  "Platinum Dreams",
  "The Bronze Age",
  "Silver Linings",
  "The Obsidian Tower",
  "Jade Mysteries",
  "The Pearl Diver",
  "Amber Waves",
  "The Coral Reef",
  "Ivory Keys",
  "The Onyx Stone",
  "Turquoise Waters",
  "The Granite Wall",
  "Marble Halls",
  "The Quartz Crystal",
  "Limestone Cliffs",
  "The Sandstone Path",
  "Slate Gray",
  "The Flint Spark",
]

const authors = [
  "Sarah Mitchell",
  "James Rodriguez",
  "Emily Chen",
  "Michael Thompson",
  "Jessica Williams",
  "David Anderson",
  "Maria Garcia",
  "Robert Johnson",
  "Lisa Davis",
  "Christopher Brown",
  "Amanda Wilson",
  "Daniel Martinez",
  "Rachel Taylor",
  "Kevin Lee",
  "Nicole White",
  "Brandon Harris",
  "Stephanie Clark",
  "Anthony Lewis",
  "Melissa Robinson",
  "Jason Walker",
  "Ashley Hall",
  "Ryan Allen",
  "Samantha Young",
  "Matthew King",
  "Lauren Wright",
  "Andrew Lopez",
  "Brittany Hill",
  "Joshua Scott",
  "Megan Green",
  "Tyler Adams",
  "Kayla Baker",
  "Nathan Gonzalez",
  "Alexis Nelson",
  "Jordan Carter",
  "Taylor Mitchell",
  "Cameron Perez",
  "Morgan Roberts",
  "Blake Turner",
  "Sydney Phillips",
  "Hayden Campbell",
  "Avery Parker",
  "Riley Evans",
  "Casey Edwards",
  "Quinn Collins",
  "Sage Stewart",
  "River Sanchez",
  "Phoenix Morris",
  "Skylar Rogers",
  "Dakota Reed",
  "Rowan Cook",
]

const genres = [
  "Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Thriller",
  "Horror",
  "Historical Fiction",
  "Contemporary Fiction",
  "Literary Fiction",
  "Young Adult",
  "Biography",
  "Memoir",
  "Self-Help",
  "Business",
  "Psychology",
  "Philosophy",
  "History",
  "Science",
  "Technology",
  "Health",
  "Cooking",
  "Travel",
  "Art",
  "Poetry",
  "Drama",
  "Adventure",
  "Crime",
  "Dystopian",
  "Paranormal",
]

// Function to generate random ISBN
function generateISBN() {
  const prefix = "978"
  const group = Math.floor(Math.random() * 10)
  const publisher = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0")
  const title = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  const check = Math.floor(Math.random() * 10)
  return `${prefix}-${group}-${publisher}-${title}-${check}`
}

// Function to generate random year between 1950 and 2024
function generateYear() {
  return Math.floor(Math.random() * (2024 - 1950 + 1)) + 1950
}

// Function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

// Generate extended titles by combining base titles with prefixes/suffixes
function generateExtendedTitle() {
  const prefixes = ["The", "A", "An", "Beyond", "Through", "Into", "Under", "Over", "Within"]
  const suffixes = ["Chronicles", "Tales", "Stories", "Legends", "Mysteries", "Adventures", "Secrets", "Revelations"]
  const adjectives = [
    "Ancient",
    "Modern",
    "Hidden",
    "Lost",
    "Forgotten",
    "Sacred",
    "Cursed",
    "Blessed",
    "Dark",
    "Bright",
  ]

  const baseTitle = getRandomItem(titles)

  // Sometimes return base title, sometimes modify it
  if (Math.random() < 0.3) {
    return baseTitle
  } else if (Math.random() < 0.5) {
    return `${getRandomItem(prefixes)} ${baseTitle}`
  } else if (Math.random() < 0.7) {
    return `${baseTitle}: ${getRandomItem(suffixes)}`
  } else {
    return `${getRandomItem(adjectives)} ${baseTitle}`
  }
}

// Generate the CSV data
console.log("Generating 10,000+ book records...")

const records = []
const targetRecords = 10500 // Generate slightly more than 10k

// Add CSV header
records.push("Title,Author,Genre,PublishedYear,ISBN")

for (let i = 0; i < targetRecords; i++) {
  const title = generateExtendedTitle()
  const author = getRandomItem(authors)
  const genre = getRandomItem(genres)
  const year = generateYear()
  const isbn = generateISBN()

  // Escape commas in titles if they exist
  const escapedTitle = title.includes(",") ? `"${title}"` : title

  records.push(`${escapedTitle},${author},${genre},${year},${isbn}`)

  // Progress indicator
  if (i % 1000 === 0) {
    console.log(`Generated ${i} records...`)
  }
}

// Write to file
const csvContent = records.join("\n")
writeFileSync("public/sample-books.csv", csvContent, "utf8")

console.log(`✅ Successfully generated ${targetRecords} book records!`)
console.log(`📁 File saved as: public/sample-books.csv`)
console.log(`📊 File size: ${Math.round(csvContent.length / 1024)} KB`)
