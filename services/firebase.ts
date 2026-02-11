import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  Auth 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  orderBy,
  Firestore,
  Timestamp
} from "firebase/firestore";
import type { Order, OrderStatus, UserProfile } from "../types";

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// --- INITIALIZATION ---
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let isMockMode = true;

try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    isMockMode = false;
  } else {
    console.warn("Firebase config is missing. Running in MOCK MODE.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  isMockMode = true;
}

// --- MOCK DATA STORE ---
let mockOrders: Order[] = [];
let mockUser: UserProfile | null = null;

// --- AUTH SERVICES ---

export const loginWithGoogle = async (): Promise<UserProfile | null> => {
  if (isMockMode) {
    mockUser = {
      uid: 'mock-user-123',
      email: 'user@example.com',
      displayName: '홍길동',
      photoURL: 'https://picsum.photos/100'
    };
    return mockUser;
  }
  
  if (!auth) throw new Error("Auth not initialized");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL
  };
};

export const logoutUser = async (): Promise<void> => {
  if (isMockMode) {
    mockUser = null;
    return;
  }
  if (!auth) return;
  await signOut(auth);
};

export const subscribeToAuth = (callback: (user: UserProfile | null) => void) => {
  if (isMockMode) {
    callback(mockUser);
    return () => {};
  }

  if (!auth) return () => {};
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } else {
      callback(null);
    }
  });
};

// --- FIRESTORE SERVICES ---

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
  const newOrder = {
    ...orderData,
    status: 'pending_payment' as OrderStatus,
    createdAt: Date.now(),
  };

  if (isMockMode) {
    mockOrders.push({ ...newOrder, id: `order_${Date.now()}` } as Order);
    return true;
  }

  if (!db) return false;
  try {
    await addDoc(collection(db, "orders"), newOrder);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

export const fetchOrders = async (currentUserEmail: string, isAdmin: boolean): Promise<Order[]> => {
  if (isMockMode) {
    return isAdmin 
      ? [...mockOrders] 
      : mockOrders.filter(o => o.userEmail === currentUserEmail);
  }

  if (!db) return [];

  try {
    const ordersRef = collection(db, "orders");
    let q;

    if (isAdmin) {
      q = query(ordersRef, orderBy("createdAt", "desc"));
    } else {
      q = query(ordersRef, where("userEmail", "==", currentUserEmail), orderBy("createdAt", "desc"));
    }

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    return orders;
  } catch (e) {
    console.error("Error fetching orders: ", e);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus): Promise<boolean> => {
  if (isMockMode) {
    const orderIndex = mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
      mockOrders[orderIndex].status = newStatus;
      return true;
    }
    return false;
  }

  if (!db) return false;
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status: newStatus });
    return true;
  } catch (e) {
    console.error("Error updating status: ", e);
    return false;
  }
};

export const isFirebaseConfigured = !isMockMode;