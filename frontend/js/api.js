const BASE_URL = "";

async function apiRequest(endpoint, method = "GET", data = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include" // keep Flask-Login session cookie
    };
    if (data) options.body = JSON.stringify(data);

    const r = await fetch(BASE_URL + endpoint, options);
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      // fallback: return raw text
      return { raw: text, status: r.status };
    }
  } catch (err) {
    return { error: "Network error: " + err.message };
  }
}
