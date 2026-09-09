const API_URL = import.meta.env.API_URL ?? '/api/';
const API_KEY = import.meta.env.API_KEY ?? '';

export async function api(
  endpoint: string,
  method: string = "GET",
  body?: BodyInit | Record<string, any>
) {

  const headers: Record<string, string> = {};
  if (API_KEY) headers["X-API-KEY"] = API_KEY;

  const options: RequestInit = {
    method,
    headers
  };

  // Si enviamos un FormData, lo usamos directamente
  if (body instanceof FormData) {

    options.body = body;

  // Si es un objeto, lo convertimos en URLSearchParams
  } else if (body && typeof body === "object") {

    options.body = new URLSearchParams(body as Record<string, string>);

  // Si ya viene preparado (string, etc.)
  } else if (body) {

    options.body = body;

  }

  
 
   const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {

    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const text = await response.text();

  if (!text) {
    return {
      status: response.status
    };
  }

  const data = JSON.parse(text);

  // La API puede responder HTTP 200 con un error en su campo `status`.
  if (
    typeof data.status === "number" &&
    (data.status < 200 || data.status >= 300)
  ) {
    throw new Error(
      typeof data.results === "string"
        ? data.results
        : `Error ${data.status}`
    );
  }

  return data;
} 