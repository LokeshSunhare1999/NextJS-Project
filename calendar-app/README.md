# CalendarApp - Firebase Authentication & Event Management

A modern calendar application built with React, Next.js, and Firebase Authentication. Features a Google Calendar-inspired interface for managing events with secure user authentication.

## Features

- **Firebase Authentication**
  - Email/Password signup and login
  - Google Sign-In integration
  - Protected routes with authentication middleware

- **Calendar Interface**
  - Google Calendar-inspired monthly view
  - Click-to-select dates
  - Today's date highlighting
  - Month navigation

- **Event Management**
  - Create, edit, and delete events
  - Time-based event scheduling
  - Event descriptions and details
  - Local storage persistence
  - Events display on calendar grid

- **Modern UI/UX**
  - Clean, professional design
  - Responsive layout
  - Dark theme support
  - Smooth animations and transitions

## Tech Stack

- **Frontend**: React 19, Next.js 15
- **Authentication**: Firebase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- Firebase project with Authentication enabled

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up Firebase configuration in your environment variables:
   \`\`\`env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and configure Email/Password and Google providers
3. Add your domain to authorized domains in Firebase Authentication settings
4. Copy your Firebase config and add to environment variables

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your Firebase environment variables in Vercel project settings
4. Deploy!

The app will be automatically deployed and available at your Vercel URL.

## Usage

1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Navigate Calendar**: Use arrow buttons to navigate between months
3. **Select Dates**: Click on any date to view/manage events for that day
4. **Add Events**: Click "Add Event" button to create new events
5. **Manage Events**: Edit or delete events using the hover actions
6. **Logout**: Use the user menu in the top-right corner

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── calendar/          # Protected calendar pages
│   ├── login/             # Authentication pages
│   ├── signup/            
│   └── globals.css        # Global styles and theme
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── calendar-grid.tsx # Main calendar interface
│   ├── event-sidebar.tsx # Event management sidebar
│   └── protected-route.tsx # Route protection
├── contexts/             # React contexts
│   └── auth-context.tsx  # Firebase auth context
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── middleware.ts         # Next.js middleware
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
