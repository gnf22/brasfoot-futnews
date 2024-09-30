// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const userCollectionRef = collection(db, "users");
const teamCollectionRef = collection(db, "teams");
const worldCupCollectionRef = collection(db, "world_cup");
const settingsCollectionRef = collection(db, "settings");

export const getIsClubEnabled = async () => {
  const data = await getDocs(settingsCollectionRef);
  const settings = data.docs.map((doc) => doc.data().isClubEnabled);
  return settings;
};

export const getIsSelectionCupEnabled = async () => {
  const data = await getDocs(settingsCollectionRef);
  const settings = data.docs.map((doc) => doc.data().isSelectionCupEnabled);
  return settings;
};

export const getIsWorldCupEnabled = async () => {
  const data = await getDocs(settingsCollectionRef);
  const settings = data.docs.map((doc) => doc.data().isWorldCupEnabled);
  return settings;
};

export const createUser = async (name: string) => {
  await addDoc(userCollectionRef, { name });
};

export const getUsersFromFirestore = async () => {
  const data = await getDocs(userCollectionRef);
  return data.docs.map((doc) => ({
    ...doc.data(), id: doc.id,
  }));
};

export const checkUserExists = async (storedName: string) => {
  const data = await getDocs(userCollectionRef);
  return data.docs.some(doc => doc.data().name === storedName);
};

export const getTeamsFromFirestore = async () => {
    const data = await getDocs(teamCollectionRef);
    return data.docs.map((doc) => ({
      ...doc.data(), id: doc.id,
    }));
  };

  export const getWorldCupSelectionsFromFireStore = async () => {
    const data = await getDocs(worldCupCollectionRef);
    return data.docs.map((doc) => ({
      ...doc.data(), id: doc.id,
    }));
  };

  export const assignCoachToTeam = async (teamId: string, coachName: string) => {
    const teamDocRef = doc(db, "teams", teamId);
    await updateDoc(teamDocRef, {
      coach: coachName
    });
  };

  export const assignCoachToWorldCupTeam = async (teamId: string, coachName: string) => {
    const teamDocRef = doc(db, "world_cup", teamId);
    await updateDoc(teamDocRef, {
      coach: coachName
    });
  };

  export const removeCoachFromTeam = async (teamId: string) => {
    const teamRef = doc(db, "teams", teamId);
    await updateDoc(teamRef, { coach: null });
  };

  export const removeCoachFromWorldCupTeam = async (teamId: string) => {
    const teamRef = doc(db, "world_cup", teamId);
    await updateDoc(teamRef, { coach: null });
  };