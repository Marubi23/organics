const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize Firebase Admin SDK
let db, auth, storage, bucket;

try {
  // Check if already initialized
  if (admin.apps.length === 0) {
    console.log('🔧 Initializing Firebase Admin...');
    
    // Method 1: Use environment variables (recommended)
    if (process.env.FIREBASE_PRIVATE_KEY) {
      console.log('🔑 Using environment variables for Firebase...');
      
      // IMPORTANT: Properly format the private key
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID || "mzuriorganics-fe88f",
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "1e83c99ae848b3bef7a4e5e391d6c1455dd48a93",
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@mzuriorganics-fe88f.iam.gserviceaccount.com",
        client_id: process.env.FIREBASE_CLIENT_ID || "107191397232826009094",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mzuriorganics-fe88f.iam.gserviceaccount.com",
        universe_domain: "googleapis.com"
      };
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://mzuriorganics-fe88f.firebaseio.com",
        storageBucket: "mzuriorganics-fe88f.appspot.com"
      });
    } 
    // Method 2: Use hardcoded service account (fallback)
    else {
      console.log('🔑 Using hardcoded service account...');
      
      // Properly format the private key
      const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCw8W/a/l/gT0NO
B0VmU9WdQ6EJcEwlMi7agX7bcBYjf7oGaT6KZLSEwXhQkRFwzHZ1df5vm/7m2D3N
BZ1g3aFc2vL0h9xlSKMh+3XTTXNyTp0STyd3SJUKqIi2AVOl0s6y5D8irkQuxho1
+wYShxLYTdnOQQkt4SCLiIAoqS3RN3rQGRVCICFXdF3PTpUxgnf1rFeo3KxSockK
M+ZIQoVK46A9FuD7zKpWOrXTRR08wcjDbDrr5re/rcvz6nB1azhjtwb/1wUn49so
5xVzZXCsjg1VsnvRVtSRD0MrNague3BosOGWa0B6tM2ZOuWr64mgFNfFrTH7fKWH
l/3+bQmJAgMBAAECggEAAtCif4zItHI6X0NLGbrHdRgqd5KZaYWT/H6vKJlOxtuN
N3Uk7TF3ND36NqjqKr3b/Bgnlzm3e09xI0H9vBjmjGpAz35aVaOrUbr1B8qthaHl
ypDnDzUgxuHBxAh/Hs4c4vhx3zC/zbEx4U44LWMH/Bg3+PmsplXUrVebd1oirBeD
td9Cn+zy55UzEDRKgHWCiUam5MLBIxACBOv0CaKTlSUaueF+bo9ERXVN2XckOill
JA3gymmh2azP3Sq0wmg73W0AHhUodklDWf7etspACqV6qP6THUp4f2X6n8EiuOib
xvc9xvPt2pGTuiPm+lZVMsKW59I4WNtuCRd7TBED8QKBgQDeBsqtRtnsRsoEPm6y
t3VnnmGzAIfZ25+Zh3//FH6ToisHvh2Gw9G2Orh0vzFTX6mTw+2iX0RdXmNLWrIy
qSG30gYBgxiGw8FHAwao9Em51ZEmXxq52rUwns0Tb1atpf2frfGeMvfKMfaYbMix
2j9ZRHxfOjKoTMROjAwOSUKnUQKBgQDMBKQBnAzi1YcMlXu/jK2VOj3dTic9QXor
mWvhKjkSWlGv6tzqnDtyoARvO+rcHLgg/9uxAC1KnwDFaibrLbwxIVyreoctGjRo
UWeRzyFnIMQME3o8dOBdawlPIrd76zT/4m1RZctZbzd9hap+KDVfUvZBQp3C51b7
LaGhzNgguQKBgQCSTkNsX43nBtbEaSelGQOCnnme7TCYPQM0tnd/7U9jla9pULxA
O/WLcbJvLDYizJ0ARFHpd4GjTTl9RGy8uXsAmKNgh7S3yXMpijLvTtruXG9jq7P+
2MIhIePddLbXgtRYTtUy/D8QvE/VLYoquLiZ6GlUjxMmmD+byul+2IPVoQKBgQC6
0MkJPEbEczg9uqfdJ8lPK0y42DawLcPcJpmVTh+CgbfpOUvffP4moQZOgPQ3aAjn
FsKp2nqeqOiA3QoUMgXwixcbYpBjKWqx11DaQGvazjMWx8MXlwJYKIoWr7iKPT+D
zGfDsE27cE7EnuAWs2TkC8i4y3JApauNRySJT1Tc6QKBgAJ9rLQCBXS6t+blEfLo
yBgCB59R9gMuhb0L6KX1M3L7OO6oLJF5euYqPTLl24aRRPaghdYsvyeBe/lChyWn
FezzrjZpDfsc9skPT6+nfQbjNh2FFcqbKRS+HOf958Z68LZ/oe90F6G2QVfLRhCw
QK1FgG6qTgtTC+EZjtslL8ou
-----END PRIVATE KEY-----`;
      
      const serviceAccount = {
        type: "service_account",
        project_id: "mzuriorganics-fe88f",
        private_key_id: "1e83c99ae848b3bef7a4e5e391d6c1455dd48a93",
        private_key: privateKey,
        client_email: "firebase-adminsdk-fbsvc@mzuriorganics-fe88f.iam.gserviceaccount.com",
        client_id: "107191397232826009094",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mzuriorganics-fe88f.iam.gserviceaccount.com",
        universe_domain: "googleapis.com"
      };
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://mzuriorganics-fe88f.firebaseio.com",
        storageBucket: "mzuriorganics-fe88f.appspot.com"
      });
    }
  }
  
  // Initialize services
  db = admin.firestore();
  auth = admin.auth();
  storage = admin.storage();
  bucket = storage.bucket();
  
  // Configure Firestore
  db.settings({ 
    ignoreUndefinedProperties: true,
    timestampsInSnapshots: true
  });
  
  console.log('✅ Firebase Admin initialized successfully');
  
  // Test Firestore connection
  (async () => {
    try {
      await db.listCollections();
      console.log('✅ Firestore connection test passed');
    } catch (error) {
      console.error('❌ Firestore connection test failed:', error.message);
      console.log('💡 TIPS:');
      console.log('   1. Check if Firestore is enabled in Firebase Console');
      console.log('   2. Verify service account has Firestore permissions');
      console.log('   3. Make sure the database exists in the selected region');
    }
  })();
  
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.error('❌ Full error:', error);
  // Initialize with null values to prevent crashes
  db = null;
  auth = null;
  storage = null;
  bucket = null;
}

// Collection references with null checks
const collections = {
  users: db ? db.collection('users') : null,
  products: db ? db.collection('products') : null,
  categories: db ? db.collection('categories') : null,
  cart: db ? db.collection('cart') : null,
  orders: db ? db.collection('orders') : null,
  payments: db ? db.collection('payments') : null,
  farmData: db ? db.collection('farm_data') : null,
  notifications: db ? db.collection('notifications') : null,
  analytics: db ? db.collection('analytics') : null,
  settings: db ? db.collection('settings') : null,
  sessions: db ? db.collection('sessions') : null
};

// Helper functions with null checks
const getTimestamp = () => db ? admin.firestore.FieldValue.serverTimestamp() : new Date();
const increment = (n) => db ? admin.firestore.FieldValue.increment(n) : n;
const arrayUnion = (...elements) => db ? admin.firestore.FieldValue.arrayUnion(...elements) : elements;
const arrayRemove = (...elements) => db ? admin.firestore.FieldValue.arrayRemove(...elements) : elements;
const createBatch = () => db ? db.batch() : null;

// Safe database operations wrapper
const safeDb = {
  // Safe query operations
  query: async (collectionName, conditions = []) => {
    if (!db) {
      console.error('❌ Firestore not initialized');
      return { empty: true, docs: [] };
    }
    
    try {
      let query = db.collection(collectionName);
      
      // Apply conditions
      conditions.forEach(condition => {
        const [field, operator, value] = condition;
        query = query.where(field, operator, value);
      });
      
      return await query.get();
    } catch (error) {
      console.error(`❌ Firestore query error on ${collectionName}:`, error.message);
      return { empty: true, docs: [] };
    }
  },
  
  // Safe document creation
  create: async (collectionName, docId, data) => {
    if (!db) {
      console.error('❌ Firestore not initialized');
      return false;
    }
    
    try {
      await db.collection(collectionName).doc(docId).set(data);
      console.log(`✅ Created ${docId} in ${collectionName}`);
      return true;
    } catch (error) {
      console.error(`❌ Firestore create error on ${collectionName}:`, error.message);
      return false;
    }
  },
  
  // Safe document update
  update: async (collectionName, docId, data) => {
    if (!db) {
      console.error('❌ Firestore not initialized');
      return false;
    }
    
    try {
      await db.collection(collectionName).doc(docId).update(data);
      console.log(`✅ Updated ${docId} in ${collectionName}`);
      return true;
    } catch (error) {
      console.error(`❌ Firestore update error on ${collectionName}:`, error.message);
      return false;
    }
  }
};

module.exports = {
  admin,
  db,
  auth,
  storage,
  bucket,
  collections,
  getTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  createBatch,
  safeDb
};