# MCP Authentication Integration Guide

## Overview

This document provides guidelines for integrating MCP (Model Context Protocol) servers with the Unified Authentication system. The authentication system uses OAuth 2.1 and implements various flows to support different types of clients, including human users, machine-to-machine services, and AI agents.

## Integration Steps for MCP Server Owners

### 1. Register Your MCP Server

To integrate with the unified authentication system, you must first register your MCP server:

- Register through the admin portal at `/admin/mcp-servers/register`
- Provide server details including name, description, and endpoints
- Specify the required scopes and permissions for your MCP server
- Configure allowed redirect URIs for authorization flows
- Generate client credentials for your server

### 2. Implement Token Validation

MCP servers must validate access tokens before granting access to protected resources:

```javascript
// Example token validation in Node.js
async function validateToken(accessToken) {
  const response = await fetch('https://auth.example.com/oauth/introspect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
    },
    body: new URLSearchParams({
      token: accessToken
    })
  });
  
  const tokenInfo = await response.json();
  
  if (tokenInfo.active) {
    // Token is valid, check scopes and other claims
    return tokenInfo;
  }
  
  // Token is invalid
  return null;
}
```

### 3. Configure Resource Server

Configure your MCP server as a resource server by:

- Implementing token validation middleware for all protected endpoints
- Configuring scope-based access control
- Setting up proper error handling for authentication failures
- Implementing logging for authentication events

### 4. Testing Your Integration

Test your integration using the provided testing tools:

- Use the OAuth 2.1 Playground at `/dev/oauth-playground`
- Run integration tests against your server
- Verify token validation logic
- Test error scenarios and edge cases

## Authentication Flows

### Human Users (Authorization Code Flow with PKCE)

For applications where humans interact with MCP servers:

1. Redirect users to the authorization endpoint
2. User authenticates and grants consent
3. Authorization code is returned to the client
4. Client exchanges code for access token using PKCE
5. Client uses access token to access MCP server resources

### Machine-to-Machine (Client Credentials Grant)

For server-to-server communication:

1. Client authenticates with client ID and secret
2. Authorization server issues access token
3. Client uses access token to access MCP server resources

### AI Agents/Tools (Dynamic Client Registration)

For AI agents and tools that need to access MCP servers:

1. Agent registers dynamically with the authorization server
2. Agent receives client credentials
3. Agent uses appropriate grant type to obtain access token
4. Agent uses access token to access MCP server resources

## Best Practices

- **Token Security**: Store tokens securely, never expose in URLs or client-side storage
- **Token Lifetimes**: Use short-lived access tokens and implement refresh token rotation
- **Error Handling**: Implement proper error handling for authentication failures
- **Logging**: Log all authentication events for security monitoring
- **Scope Usage**: Request only the scopes needed for the specific operation
- **Token Validation**: Always validate tokens before granting access

## Troubleshooting

| Issue | Possible Causes | Resolution |
|-------|----------------|------------|
| Invalid token | Token expired | Refresh the token |
| Invalid token | Token tampered | Request a new token |
| Insufficient scope | Missing required permissions | Request token with appropriate scopes |
| Client not authorized | Client ID not registered | Register client through admin portal |
| Rate limit exceeded | Too many requests | Implement backoff strategy |

## Support

For integration support, contact the authentication team at auth-support@example.com or open an issue in the support portal.
