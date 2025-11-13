# Firebase Setup Guide

## Prerequisites
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the services you need (Authentication, Firestore, Storage, etc.)

## Configuration Steps

1. **Create a `.env` file** in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

2. **Get your Firebase config values:**
   - Go to Firebase Console → Project Settings → General
   - Scroll down to "Your apps" section
   - Click on the web app icon (</>) or create a new web app
   - Copy the config values to your `.env` file

## Usage

Import Firebase services in your components:

```typescript
import { auth, db, storage } from './firebase';

// Example: Using Authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
signInWithEmailAndPassword(auth, email, password);

// Example: Using Firestore
import { collection, getDocs } from 'firebase/firestore';
const querySnapshot = await getDocs(collection(db, 'users'));

// Example: Using Storage
import { ref, uploadBytes } from 'firebase/storage';
const storageRef = ref(storage, 'images/photo.jpg');
```

## Available Services

- **Authentication** (`auth`): User authentication
- **Firestore** (`db`): NoSQL database
- **Storage** (`storage`): File storage

## Security Rules

Don't forget to configure security rules in Firebase Console:
- Firestore Rules
- Storage Rules
- Authentication settings
