export function validatePassword(password) {
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }

  return null;
}
