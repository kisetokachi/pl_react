const API_URL = '/api/auth';

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || '認証に失敗しました。');
    console.log("送信が失敗しました")
  }

  return response.json();
};