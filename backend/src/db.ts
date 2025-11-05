import * as admin from 'firebase-admin';

// Initialize the Firebase Admin SDK.
// When running on Google Cloud, the SDK automatically discovers credentials.
// For local development, you would need to set the GOOGLE_APPLICATION_CREDENTIALS
// environment variable to point to your service account key file.
admin.initializeApp();

// Get the Firestore instance.
const db = admin.firestore();

export default db;
