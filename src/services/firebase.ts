// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2fEBnnEK1ibG3WTiYdPn1Ch8J6ZOn2oE",
  authDomain: "futnews-brasfoot.firebaseapp.com",
  projectId: "futnews-brasfoot"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const userCollectionRef = collection(db, "users");
const teamCollectionRef = collection(db, "teams");

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

  export const assignCoachToTeam = async (teamId: string, coachName: string) => {
    const teamDocRef = doc(db, "teams", teamId);
    await updateDoc(teamDocRef, {
      coach: coachName // Altere conforme a estrutura que você deseja
    });
  };

  export const removeCoachFromTeam = async (teamId: string) => {
    const teamRef = doc(db, "teams", teamId);
    await updateDoc(teamRef, { coach: null }); // Remove o treinador do time
  };
      