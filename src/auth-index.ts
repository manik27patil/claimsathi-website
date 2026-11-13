import { supabase } from "../supabase";
import { signUp, signIn, signOut, resetPassword, updatePassword, initAuth, getAuthState, subscribeAuth, Profile } from "../auth";

// Export for use by page modules
export { supabase, signUp, signIn, signOut, resetPassword, updatePassword, initAuth, getAuthState, subscribeAuth };
export type { Profile };
