import { supabase, Profile } from "./supabase";

export interface AuthState {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
}

let currentState: AuthState = { user: null, profile: null, loading: true };
const listeners: ((s: AuthState) => void)[] = [];

export function getAuthState(): AuthState {
  return currentState;
}

export function subscribeAuth(fn: (s: AuthState) => void): () => void {
  listeners.push(fn);
  fn(currentState);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function setState(s: AuthState) {
  currentState = s;
  for (const fn of listeners) fn(s);
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) return null;
  return data as Profile | null;
}

export async function initAuth() {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    const profile = await fetchProfile(data.session.user.id);
    setState({ user: { id: data.session.user.id, email: data.session.user.email || "" }, profile, loading: false });
  } else {
    setState({ user: null, profile: null, loading: false });
  }

  supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      if (event === "SIGNED_OUT" || !session?.user) {
        setState({ user: null, profile: null, loading: false });
        return;
      }
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const profile = await fetchProfile(session.user.id);
        setState({ user: { id: session.user.id, email: session.user.email || "" }, profile, loading: false });
      }
    })();
  });
}

export async function signUp(fullName: string, email: string, mobile: string, password: string): Promise<{ error: string | null }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, mobile_number: mobile } },
  });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Registration failed. Please try again." };

  // Create profile record
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    full_name: fullName,
    mobile_number: mobile,
    email: email,
  });
  if (profileError) {
    // Profile creation failed but auth user exists — not critical, can be retried
    console.warn("Profile creation failed:", profileError.message);
  }

  return { error: null };
}

export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { error: null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/#/reset-password",
  });
  if (error) return { error: error.message };
  return { error: null };
}

export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { error: null };
}
