import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, clearUser } from '../store/authSlice';
import { signInWithGoogle, logOut, onAuthChange, isConfigured } from '../utils/auth';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const configured = isConfigured();

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  const login = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const logout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return { user, loading, login, logout, configured };
}
