// src/admin/widgets/keycloak-login.tsx

const KeycloakLogin = () => {
  const handleLogin = () => {
    // Implement the login flow with your custom provider
    fetch(`/auth/admin/keycloak`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.location) {
          window.location.href = data.location
        }
      })
  }

  return (
    <div>
      <button onClick={handleLogin}>Login with Keycloak</button>
    </div>
  )
}

export const config = {
  zone: "auth.login.after",
}

export default KeycloakLogin