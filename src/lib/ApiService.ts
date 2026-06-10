const API_BASE_URL = 'https://arcana-api-6x0i.onrender.com';

export async function requestReading(params: {
  messages: Array<{ role: string; content: string }>;
}): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/reading`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || '请求失败');
  }
  return response.json();
}
