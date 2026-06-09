// Cliente HTTP central: fala com a API .NET. Troca o antigo "banco" em localStorage.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // 204 No Content (ex.: DELETE) não tem corpo.
  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    // resposta sem JSON
  }

  if (!res.ok) {
    // Erros de negócio vêm como { message }. Erros de validação ([ApiController])
    // vêm como ProblemDetails com { errors: { campo: [msgs] } }.
    let message = data?.message;
    if (!message && data?.errors) {
      const first = Object.values(data.errors)[0];
      message = Array.isArray(first) ? first[0] : String(first);
    }
    throw new Error(message || 'Erro na requisição.');
  }

  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
};
