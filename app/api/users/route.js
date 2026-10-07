import { NextResponse } from 'next/server';
import { db, firebaseConfig } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs.map((d) => ({
      ...d.data(),
      id: d.id,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role, uid } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user with this email already exists in Firestore DB
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    const existing = snapshot.docs.find(
      (d) => d.data().email && d.data().email.trim().toLowerCase() === cleanEmail
    );

    if (existing) {
      return NextResponse.json(
        { error: `User with email "${cleanEmail}" already exists in the system.` },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey;
    let firebaseUid = uid;

    // 2. Create user in Firebase Authentication via Identity Toolkit REST API
    if (!firebaseUid) {
      const userPassword = password && password.trim() ? password.trim() : 'Estimator123!';
      if (userPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
      }

      const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: userPassword,
          returnSecureToken: true,
        }),
      });

      const authData = await authRes.json();

      if (!authRes.ok) {
        const errMsg = authData.error?.message;
        if (errMsg === 'EMAIL_EXISTS') {
          return NextResponse.json(
            { error: `User with email "${cleanEmail}" already exists in Firebase Authentication.` },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: authData.error?.message || 'Failed to create user in Firebase Authentication' },
          { status: 400 }
        );
      }

      firebaseUid = authData.localId;
    }

    const userId = firebaseUid || `user-${Date.now().toString(36)}`;
    const newUser = {
      id: userId,
      uid: userId,
      name: name.trim(),
      email: cleanEmail,
      role: role || 'Estimator',
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    // 3. Save user profile document in Firestore users collection
    await setDoc(doc(db, 'users', userId), newUser);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user', details: error.message }, { status: 500 });
  }
}
