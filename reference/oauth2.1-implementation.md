# OAuth 2.1 Implementation Guide

## Introduction to OAuth 2.1

OAuth 2.1 is an evolution of the OAuth 2.0 framework that consolidates the most widely implemented features and security best practices. Key improvements in OAuth 2.1 include:

- Mandatory PKCE for all authorization code flows
- Removal of the implicit grant type
- Removal of resource owner password credentials grant
- Exact redirect URI matching requirement
- Prohibiting bearer tokens in URL query parameters
- Enhanced refresh token security

## Implementation Architecture

Our OAuth 2.1 implementation for MCP authentication follows this architecture:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│   Client    │────▶│ Auth Server │     │ MCP Server  │
│             │◀────│             │     │ (Resource   │
└─────────────┘     └─────────────┘     │  Server)    │
       │                                 └─────────────┘
       │                                        ▲
       │                                        │
       └────────────────────────────────────────┘
```

### Core Components

1. **Authorization Server**
   - Handles authentication of resource owners
   - Issues access tokens and refresh tokens
   - Manages token lifecycle and revocation
   - Provides introspection endpoints

2. **Resource Server (MCP Server)**
   - Validates access tokens
   - Enforces scope-based permissions
   - Protects MCP resources

3. **Clients**
   - Web applications
   - Mobile applications
   - Backend services
   - AI agents and tools

## Implemented OAuth 2.1 Flows

### Authorization Code Flow with PKCE

The primary flow for interactive clients with human users:

1. Client generates a code verifier and code challenge
2. Client redirects user to authorization endpoint with code challenge
3. User authenticates and authorizes the client
4. Authorization server redirects back with authorization code
5. Client exchanges code and code verifier for tokens
6. Client uses access token to access protected resources

```javascript
// Example code verifier and challenge generation
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

function generateCodeChallenge(codeVerifier) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
    .then(digest => base64UrlEncode(new Uint8Array(digest)));
}
```

### Client Credentials Grant

For machine-to-machine authentication:

1. Client authenticates with client ID and secret
2. Authorization server issues access token
3. Client uses access token to access protected resources

```javascript
// Example client credentials grant
async function getClientCredentialsToken() {
  const response = await fetch('https://auth.example.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'scope': 'model:read model:execute'
    })
  });
  
  return response.json();
}
```

### Refresh Token Flow

For obtaining new access tokens without re-authentication:

1. Client sends refresh token to token endpoint
2. Authorization server validates refresh token
3. Authorization server issues new access token and (optionally) new refresh token
4. Client uses new access token for requests

```javascript
// Example refresh token usage
async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://auth.example.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: new URLSearchParams({
      'grant_type': 'refresh_token',
      'refresh_token': refreshToken
    })
  });
  
  return response.json();
}
```

## Token Formats and Validation

### JWT Access Tokens

We use JWT (JSON Web Tokens) for access tokens with the following claims:

- `iss` (issuer): Identifies the token issuer
- `sub` (subject): Identifies the subject of the token (user ID, client ID)
- `aud` (audience): Identifies intended recipients (MCP server IDs)
- `exp` (expiration time): When the token expires
- `iat` (issued at): When the token was issued
- `jti` (JWT ID): Unique identifier for the token
- `scope`: Space-separated list of granted scopes

Example JWT payload:
```json
{
  "iss": "https://auth.example.com",
  "sub": "user123",
  "aud": "mcp-server-xyz",
  "exp": 1622154294,
  "iat": 1622150694,
  "jti": "abc123def456",
  "scope": "model:read model:execute"
}
```

### Token Validation

Resource servers should validate tokens by:

1. Verifying the token signature using the public key
2. Checking that the token is not expired
3. Validating the issuer and audience claims
4. Ensuring the required scopes are present

## Security Considerations

- Use RS256 or ES256 for JWT signature
- Implement key rotation for signing keys
- Use short-lived access tokens (15 minutes maximum)
- Implement refresh token rotation
- Use HTTPS for all endpoints
- Implement rate limiting to prevent brute force attacks
- Log all token issuance and validation events

## Advanced Features

### Token Binding with DPoP

Demonstrating Proof of Possession (DPoP) binds access tokens to a specific client:

1. Client generates a public/private key pair
2. Client creates a DPoP proof JWT signed with the private key
3. Client sends DPoP proof with token requests
4. Server validates the proof and binds the token to the public key
5. Client must present valid DPoP proof with each API request

### mTLS for Client Authentication

For high-security machine-to-machine scenarios:

1. Client and server establish a TLS connection with mutual authentication
2. Client presents its certificate during the TLS handshake
3. Server validates the client certificate against a trusted store
4. Server uses the certificate subject or thumbprint for client identification

## Implementation Checklist

- [ ] Set up authorization server endpoints (authorize, token, introspect, revoke)
- [ ] Implement PKCE validation logic
- [ ] Configure JWT signing and validation
- [ ] Set up client registration and management
- [ ] Implement token storage and lifecycle management
- [ ] Configure security headers and HTTPS
- [ ] Set up monitoring and logging
- [ ] Implement rate limiting and anomaly detection
- [ ] Create developer documentation and examples
