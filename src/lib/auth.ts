type ClerkGetToken = (options?: Record<string, unknown>) => Promise<string | null>;

const AUTH_TIMEOUT_MS = 15000;

async function withTimeout<T>(promise: Promise<T>, context: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Authentication timed out during ${context}.`));
    }, AUTH_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function getAuthToken(
  getToken: ClerkGetToken,
  context: string,
): Promise<string> {
  console.log(`[Auth] Requesting token for ${context}`);
  const token = await withTimeout(getToken({}), context);

  if (!token) {
    throw new Error(`Missing auth token during ${context}.`);
  }

  return token;
}
