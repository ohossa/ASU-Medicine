async function authenticatedRequest<T>(
  endpoint: string,
  getToken: () => Promise<string | null>,
  suffix = "",
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  if (!token) throw new Error("Please sign in to continue.");
  const response = await fetch(endpoint + suffix, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    signal: options.signal ?? AbortSignal.timeout(20000),
  });
  const result = await response.json().catch(() => {
    throw new Error("Reporting is temporarily unavailable. Please try again.");
  });
  if (!result || typeof result !== "object" || Array.isArray(result))
    throw new Error("Reporting is temporarily unavailable. Please try again.");
  if (!response.ok || result.error)
    throw Object.assign(
      new Error(result.error || "Unable to complete this request."),
      { status: response.status },
    );
  return result as T;
}

export function reportRequest<T>(getToken: () => Promise<string|null>, suffix = '', options: RequestInit = {}) { return authenticatedRequest<T>('/api/question-reports',getToken,suffix,options); }
export function questionBankRequest<T>(getToken: () => Promise<string|null>, suffix = '', options: RequestInit = {}) { return authenticatedRequest<T>('/api/question-bank',getToken,suffix,options); }
