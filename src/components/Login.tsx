const handleSubmit = async (e: React.FormEvent, asAdmin: boolean = false) => {
  e.preventDefault();
  setError('');
  const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
  const payload = isRegister ? { email, password, displayName } : { email, password };
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    let data;

    try {
      data = await res.json();
    } catch (e) {
      const text = await res.text();
      console.error("RAW RESPONSE:", text);
      throw new Error(`Invalid JSON from server (${res.status})`);
    }
    
    if (!res.ok) {
      setError(data.error || 'Authentication failed');
      return;
    }
    
    if (asAdmin && !data.user.isAdmin) {
      setError('You are not authorized to login as admin.');
      return;
    }
    
    localStorage.setItem('auth_token', data.token);
    onLoginSuccess(data.user.isAdmin ? 'admin' : 'home', data.token, data.user);

  } catch (err: any) {
    console.error("Auth error", err);
    setError(err.message || "Failed to authenticate. Please check connection.");
  }
};
