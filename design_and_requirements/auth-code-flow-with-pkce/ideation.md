# Ideation — Authorization Code Flow with PKCE for Human Users

## Cycle 1 — 2025-05-30

### Decisions to Take

1. **PKCE Implementation Approach**
   - Require PKCE for all clients (both public and confidential)
   - Support both plain and S256 challenge methods, but recommend S256
   - Implement server-side storage of PKCE verifiers during the flow
   - Require code_challenge_method parameter to prevent downgrade attacks

2. **Client Type Handling**
   - Treat SPAs and mobile apps as public clients
   - Implement different redirect mechanisms based on client type
   - Enable automatic client type detection where possible
   - Apply client-type specific security measures (e.g., more stringent rate limiting for public clients)

3. **Authorization Code Properties**
   - Use high-entropy, cryptographically secure random codes
   - Set 60-second maximum lifetime for authorization codes
   - Enforce one-time use with immediate invalidation after use
   - Bind codes to specific client IDs, redirect URIs, and PKCE verifiers

4. **Session and State Management**
   - Implement secure HTTP-only cookies for session management
   - Require state parameter for all authorization requests
   - Generate new session after successful authentication (prevent session fixation)
   - Implement proper session expiration and idle timeout

5. **User Experience Design**
   - Create a streamlined consent experience with clear scope descriptions
   - Support "remember consent" functionality for trusted applications
   - Implement responsive design that works across all device types
   - Support accessibility standards (WCAG 2.1 AA compliance)

### Reasoning / Trade-offs

1. **PKCE for All Clients**
   - **Reasoning**: While OAuth 2.1 only mandates PKCE for public clients, extending it to all clients provides defense-in-depth
   - **Trade-off**: Slightly increased complexity for confidential clients vs. consistent security model
   - **Decision factor**: The minimal additional overhead is worth the security benefit and simplifies the implementation

2. **Authorization Code Lifetime**
   - **Reasoning**: Short-lived codes reduce the window of opportunity for attacks
   - **Trade-off**: Very short lifetimes might cause user experience issues with slow connections or devices
   - **Decision factor**: 60 seconds balances security with reasonable user experience, allowing sufficient time for code exchange while minimizing risk

3. **Session Management Approach**
   - **Reasoning**: HTTP-only cookies provide better security than localStorage for session management
   - **Trade-off**: Cookies have limitations with cross-domain scenarios and require careful configuration
   - **Decision factor**: Security benefits outweigh the implementation complexity, and we can provide guidance for cross-domain scenarios

4. **Scope Granularity**
   - **Reasoning**: Granular scopes give users more control but can lead to consent fatigue
   - **Trade-off**: User control vs. user experience simplicity
   - **Decision factor**: Group related permissions into logical scopes and provide clear descriptions to balance control and usability

5. **Error Handling Verbosity**
   - **Reasoning**: Detailed error messages help developers but may expose too much information
   - **Trade-off**: Developer experience vs. security
   - **Decision factor**: Use detailed errors in development environments but limit information in production, providing error codes that developers can look up

### Alternatives Explored

1. **Authentication Mechanisms**
   - **Username/password only**: Simplest to implement but limited security
   - **Multi-factor authentication**: Enhanced security but more complex user experience
   - **Passwordless authentication**: Improved user experience but requires additional infrastructure
   - **Selected approach**: Start with username/password with MFA option, design for passwordless as a future enhancement

2. **Code Challenge Methods**
   - **S256 only**: Most secure but might limit some legacy clients
   - **plain only**: Simplest but vulnerable if TLS is compromised
   - **Selected approach**: Support both with S256 recommended and default, allowing for backward compatibility while encouraging best practices

3. **Token Storage Approaches**
   - **JWT with local validation**: Reduces database lookups but complicates revocation
   - **Opaque tokens with database**: Enables revocation but requires lookups for each validation
   - **Hybrid approach**: JWT for short-lived access tokens, opaque for refresh tokens
   - **Selected approach**: Hybrid approach balances performance and security needs

4. **Client Authentication Methods**
   - **Client secret only**: Simple but less secure for high-value clients
   - **JWT assertion**: More secure but more complex to implement
   - **mTLS**: Highest security but significant implementation complexity
   - **Selected approach**: Client secret as baseline with JWT assertion option for high-security scenarios, mTLS as a stretch goal

5. **Consent Screen Designs**
   - **Minimal consent**: Simplest user experience but less transparency
   - **Detailed permission explanation**: Most transparent but potentially overwhelming
   - **Progressive disclosure**: Balances simplicity and transparency but more complex to implement
   - **Selected approach**: Progressive disclosure with essential information upfront and details available on demand

### Open Issues

1. **Integration with Existing User System**
   - How will the authorization flow integrate with the existing user authentication system?
   - What authentication methods are currently supported and should be maintained?
   - Is there a single sign-on experience that needs to be preserved?

2. **Mobile App Requirements**
   - What specific mobile platforms need to be supported (iOS, Android, other)?
   - Should we implement support for mobile app deep linking or universal links?
   - What are the requirements for mobile app state preservation during authentication?

3. **Performance Requirements**
   - What is the expected peak load for authorization requests?
   - Are there specific latency requirements for different parts of the authentication flow?
   - How will performance be measured and monitored?

4. **Scope Management**
   - How will scopes be defined, managed, and documented?
   - Who will be responsible for approving new scopes?
   - How will scope descriptions be maintained across multiple languages?

5. **Compliance Requirements**
   - Are there specific compliance requirements (GDPR, CCPA, etc.) that affect the authorization flow?
   - How should user consent be recorded for compliance purposes?
   - What audit trail is required for authorization events?

6. **Error Handling Strategy**
   - How detailed should error messages be in production?
   - Should we implement custom error codes beyond the OAuth 2.1 standard?
   - How will errors be communicated to end-users vs. developers?

7. **Testing Approach**
   - What testing environments will be available?
   - How will we test across different client types (web, mobile, etc.)?
   - What security testing will be performed before launch?
