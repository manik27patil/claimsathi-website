import { supabase } from "../supabase";
import { signInWithGoogle, signOut, initAuth, subscribeAuth, getAuthState, updateProfile, isProfileComplete } from "../auth";

// Export for use by page modules
export { supabase, signInWithGoogle, signOut, initAuth, subscribeAuth, getAuthState, updateProfile, isProfileComplete };
export type { Profile };
