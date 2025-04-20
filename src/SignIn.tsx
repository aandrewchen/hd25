import { useAuthActions } from "@convex-dev/auth/react";

export function SignIn() {
  const { signIn } = useAuthActions();
  return (
    <button onClick={() => void signIn("github", { redirectTo: "/home" })}>
      Sign in with GitHub
    </button>
  );
}
