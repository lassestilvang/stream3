# Signup Page Architectural Plan

## Overview
Design a user signup page at `app/auth/signup/page.tsx` based on the existing signin page structure. The signup page will include fields for name, email, password, and confirm password, with form validation, error handling, and backend integration for user registration and email verification.

## File Structure
```
app/auth/signup/
  page.tsx                    # Main signup page component
app/api/auth/signup/
  route.ts                    # API endpoint for user registration
app/auth/verify/
  page.tsx                    # Email verification page (if needed)
lib/
  email.ts                    # Email sending utility (new)
```

## Component Breakdown

### SignupPage Component (`app/auth/signup/page.tsx`)
- **Type**: Client component (`"use client"`)
- **State Management**:
  - `name`: string
  - `email`: string
  - `password`: string
  - `confirmPassword`: string
  - `loading`: boolean
  - `error`: string
  - `fieldErrors`: object for individual field errors
- **UI Structure**:
  - Container: Centered layout matching signin page
  - Header: "Create Account" title and description
  - Form:
    - Name input (required)
    - Email input (required, type="email")
    - Password input (required, type="password")
    - Confirm Password input (required, type="password")
    - Error display (general and field-specific)
    - Submit button (disabled during loading)
  - Social Signup Options:
    - "Sign up with GitHub" button
    - "Sign up with Google" button
    - Separator ("or")
  - Link to signin page

### Form Validation
- **Client-side Validation**:
  - Name: Required, minimum 2 characters
  - Email: Required, valid email format
  - Password: Required, minimum 8 characters, include uppercase, lowercase, number
  - Confirm Password: Must match password
- **Validation Triggers**: On blur and on submit
- **Error Display**: Inline below each field, general errors at top

### Error Handling
- **Network Errors**: Display "Unable to create account. Please try again."
- **Validation Errors**: Field-specific messages
- **Duplicate Email**: "An account with this email already exists"
- **Loading States**: Button shows "Creating account..." with disabled state

## State Management
- **Local State**: useState for all form fields and UI states
- **No Global State**: Keep simple, no need for context or Redux
- **Form Reset**: Clear fields on successful submission

## API Integration

### Registration Endpoint (`app/api/auth/signup/route.ts`)
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  - Success: 201 Created, { "message": "Account created. Please check your email for verification." }
  - Error: 400 Bad Request (validation), 409 Conflict (email exists), 500 Internal Server Error

### Backend Logic
1. **Input Validation**: Server-side validation matching client
2. **Email Uniqueness Check**: Query users table for existing email
3. **Password Hashing**: Use bcrypt with salt rounds (e.g., 12)
4. **User Creation**: Insert into users table with hashed password
5. **Verification Token Generation**: Create entry in verificationTokens table
6. **Email Sending**: Send verification email with link to `/auth/verify?token=<token>`

### Social Signup Integration
- **Providers**: GitHub and Google (using existing NextAuth configuration)
- **Flow**:
  - User clicks "Sign up with GitHub/Google"
  - Calls `signIn("github"/"google", { callbackUrl: "/" })`
  - NextAuth handles OAuth flow and account creation
  - For OAuth accounts, set `emailVerified` to current timestamp automatically
  - Redirect to home page on success
- **UI**: Buttons styled consistently with form submit button
- **Error Handling**: Display OAuth errors if signin fails

### Email Verification Flow
1. **Email Content**: "Click here to verify your email: /auth/verify?token=<token>"
2. **Verification Page** (`app/auth/verify/page.tsx`):
   - Extract token from URL
   - Call API to verify token
   - Update user.emailVerified timestamp
   - Delete verification token
   - Redirect to signin with success message
3. **Verification API**: `app/api/auth/verify/route.ts` (GET/POST)

### Dependencies
- **Existing**: NextAuth, Drizzle ORM, bcrypt (assume installed)
- **New**: nodemailer for email sending, email templates

### Security Considerations
- Password hashing with bcrypt
- Input sanitization
- Rate limiting on signup endpoint
- Secure token generation for email verification
- HTTPS for email links

### Testing Integration
- Unit tests for validation logic
- Integration tests for API endpoints
- E2E tests for signup flow

### Accessibility
- Proper labels and ARIA attributes
- Keyboard navigation support
- Screen reader friendly error messages

## Implementation Sequence
1. Create signup page component with form and social buttons
2. Implement client-side validation
3. Create signup API endpoint
4. Implement social signup integration
5. Implement email verification flow
6. Add error handling and loading states
7. Test and refine