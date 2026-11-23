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

export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false;
  return Boolean(profile.mobile_number && profile.country_code && profile.country);
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
        const user = session.user;
        let profile = await fetchProfile(user.id);

        // First-time Google sign-in: auto-create profile from Google metadata
        if (!profile) {
          const googleName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Policyholder";
          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            full_name: googleName,
            email: user.email || "",
            mobile_number: null,
            country: null,
          });
          if (!insertError) {
            profile = await fetchProfile(user.id);
          }
        }

        setState({ user: { id: user.id, email: user.email || "" }, profile, loading: false });
      }
    })();
  });
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + "/auth/dashboard.html",
    },
  });
  if (error) return { error: error.message };
  return { error: null };
}

export async function updateProfile(updates: { mobile_number?: string; country_code?: string; country?: string }): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message };

  const profile = await fetchProfile(user.id);
  setState({ user: { id: user.id, email: user.email || "" }, profile, loading: false });
  return { error: null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
