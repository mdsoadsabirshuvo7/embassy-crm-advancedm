import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface OrgInvitation {
  id?: string;
  orgId: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'revoked';
  createdAt?: any;
  acceptedAt?: any;
  token: string; // simple random token
}

export class InvitationService {
  static async inviteUser(orgId: string, email: string, role: string): Promise<OrgInvitation> {
    const token = Math.random().toString(36).slice(2);
    const docRef = await addDoc(collection(db, 'orgInvitations'), { orgId, email, role, status: 'pending', token, createdAt: serverTimestamp() });
    return { id: docRef.id, orgId, email, role, status: 'pending', token };
  }

  static async findByToken(token: string): Promise<OrgInvitation | null> {
    const q = query(collection(db, 'orgInvitations'), where('token', '==', token));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as Omit<OrgInvitation,'id'>) };
  }

  static async acceptInvitation(inviteId: string) {
    await updateDoc(doc(db, 'orgInvitations', inviteId), { status: 'accepted', acceptedAt: serverTimestamp() });
  }

  static async revokeInvitation(inviteId: string) {
    await updateDoc(doc(db, 'orgInvitations', inviteId), { status: 'revoked' });
  }
}
