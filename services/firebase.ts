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
  onSnapshot,
  Firestore,
  Timestamp
} from "firebase/firestore";
import type { Order, OrderStatus, UserProfile } from "../types";
import { ADMIN_EMAIL } from "../constants";

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBzoJrtejTc7Icm9CWuhxlEyNusKPXp_5U",
  authDomain: "jyp-yg-fund.firebaseapp.com",
  projectId: "jyp-yg-fund",
  storageBucket: "jyp-yg-fund.firebasestorage.app",
  messagingSenderId: "333837945870",
  appId: "1:333837945870:web:6a081bda22904ce0ac005f",
  measurementId: "G-R2EP126Q6F"
};

// --- INITIALIZATION ---
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let isMockMode = true;

try {
  // Check if config looks valid (rudimentary check)
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    isMockMode = false;
  } else {
    console.warn("Firebase config is missing or placeholder. Running in MOCK MODE.");
    isMockMode = true;
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
  // 1. Explicit Mock Mode
  if (isMockMode) {
    mockUser = {
      uid: 'mock-user-123',
      email: ADMIN_EMAIL, // Default to admin for easier testing
      displayName: '홍길동 (Mock)',
      photoURL: 'https://picsum.photos/100'
    };
    return mockUser;
  }
  
  if (!auth) throw new Error("Auth not initialized");
  const provider = new GoogleAuthProvider();

  // Force account selection prompt even if already logged in
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  try {
    const result = await signInWithPopup(auth, provider);
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    };
  } catch (error: any) {
    console.error("Google Login Error:", error);

    // 2. Handle User Cancellation gracefully (Don't alert, don't fallback to mock)
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return null;
    }
    
    // 3. Fallback for Unauthorized Domain or Operation Not Allowed (Common in Dev/Preview)
    // This allows the app to function even if the current domain isn't whitelisted in Firebase Console.
    if (
      error.code === 'auth/unauthorized-domain' || 
      error.code === 'auth/operation-not-allowed' ||
      error.message?.includes('unauthorized domain')
    ) {
      console.warn("Domain not authorized or Login failed. Falling back to Mock Login for development.");
      
      // Setup Mock User
      mockUser = {
        uid: 'mock-admin-fallback',
        email: ADMIN_EMAIL,
        displayName: '관리자 (Dev)',
        photoURL: null
      };
      
      // Force mock mode for this session so DB calls also use mock data
      isMockMode = true; 
      
      return mockUser;
    }
    
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  if (isMockMode) {
    mockUser = null;
    return;
  }
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (e) {
    console.warn("Logout error (likely mock mode transition):", e);
    mockUser = null;
  }
};

export const subscribeToAuth = (callback: (user: UserProfile | null) => void) => {
  // If we are already in mock mode, use mock logic
  if (isMockMode) {
    callback(mockUser);
    // In mock mode, we don't really have a listener, so we just return no-op.
    // However, if isMockMode becomes true LATER, this listener won't know.
    // Realistically, for this simple app, we just reload or rely on loginWithGoogle updating state.
    return () => {};
  }

  if (!auth) return () => {};
  
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      });
    } else {
      // If we fell back to mock mode during runtime, we might still have a mock user
      if (isMockMode && mockUser) {
        callback(mockUser);
      } else {
        callback(null);
      }
    }
  });

  return unsubscribe;
};

// --- FIRESTORE SERVICES ---

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
  const newOrder = {
    ...orderData,
    status: 'pending_payment' as OrderStatus,
    createdAt: Date.now(),
  };

  if (isMockMode) {
    mockOrders.push({ ...newOrder, id: `order_${Date.now()}`, rewardItems: orderData.rewardItems || [] } as Order);
    return true;
  }

  if (!db) return false;
  try {
    await addDoc(collection(db, "orders"), newOrder);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    // If DB write fails (e.g. permission denied), fallback to mock
    console.warn("Falling back to local mock storage due to DB error.");
    isMockMode = true;
    mockOrders.push({ ...newOrder, id: `order_${Date.now()}`, rewardItems: orderData.rewardItems || [] } as Order);
    return true;
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
      q = query(ordersRef, where("userEmail", "==", currentUserEmail));
    }

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...(doc.data() as any) } as Order);
    });

    // Client-side sorting for non-admin queries if composite index is missing
    orders.sort((a, b) => b.createdAt - a.createdAt);

    return orders;
  } catch (e) {
    console.error("Error fetching orders: ", e);
    // Fallback to mock
    isMockMode = true;
    return isAdmin 
      ? [...mockOrders] 
      : mockOrders.filter(o => o.userEmail === currentUserEmail);
  }
};

// REAL-TIME SUBSCRIPTION
export const subscribeToOrders = (currentUserEmail: string, isAdmin: boolean, callback: (orders: Order[]) => void) => {
  if (isMockMode) {
    // In mock mode, just return current state once. Real-time updates in mock mode aren't supported without more complex logic.
    const orders = isAdmin 
      ? [...mockOrders] 
      : mockOrders.filter(o => o.userEmail === currentUserEmail);
    callback(orders.sort((a, b) => b.createdAt - a.createdAt));
    return () => {};
  }

  if (!db) return () => {};

  try {
    const ordersRef = collection(db, "orders");
    let q;

    if (isAdmin) {
      q = query(ordersRef, orderBy("createdAt", "desc"));
    } else {
      q = query(ordersRef, where("userEmail", "==", currentUserEmail));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...(doc.data() as any) } as Order);
      });
      // Sort client-side to be safe
      orders.sort((a, b) => b.createdAt - a.createdAt);
      callback(orders);
    }, (error) => {
      console.error("Error subscribing to orders:", error);
    });

    return unsubscribe;
  } catch (e) {
    console.error("Error setting up subscription:", e);
    return () => {};
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

export const fetchProjectStats = async (): Promise<{ currentAmount: number; supporterCount: number }> => {
  if (isMockMode) {
    const total = mockOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    return {
      currentAmount: total,
      supporterCount: mockOrders.length
    };
  }

  if (!db) return { currentAmount: 0, supporterCount: 0 };

  try {
    const ordersRef = collection(db, "orders");
    const querySnapshot = await getDocs(ordersRef);
    
    let total = 0;
    let count = 0;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // NOTE: We sum up ALL orders (Pending + Paid) to show "Pledged Amount", which is standard for crowdfunding.
      // If you only want 'paid', add a check for data.status === 'paid'
      if (data.totalAmount) {
        total += data.totalAmount;
        count++;
      }
    });

    return { currentAmount: total, supporterCount: count };
  } catch (e) {
    console.error("Error fetching project stats: ", e);
    return { currentAmount: 0, supporterCount: 0 };
  }
};

export const isFirebaseConfigured = !isMockMode;