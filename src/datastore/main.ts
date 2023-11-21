import { Firestore } from '@google-cloud/firestore';
// import { FirestoreConfig } from './types/main.ts';

export function getFirestore(): Firestore { return new Firestore() };
