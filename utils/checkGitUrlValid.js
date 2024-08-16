export function isValidGitUrl(url) {
  // Regular expression to match typical Git repository URLs
  const gitUrlPattern =
    /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\/.+$/;

  // Test the URL against the pattern
  return gitUrlPattern.test(url);
}