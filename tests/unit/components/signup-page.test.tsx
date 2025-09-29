// tests/unit/components/signup-page.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import SignUpPage from "@/app/auth/signup/page";

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("SignUpPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ message: "Account created successfully" }),
    });
  });

  it("renders signup form with all required fields", () => {
    render(<SignUpPage />);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText("Sign up to track your movies and TV shows")).toBeInTheDocument();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up with GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up with Google" })).toBeInTheDocument();

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows validation errors for empty form submission", async () => {
    render(<SignUpPage />);

    const submitButton = screen.getByRole("button", { name: "Create Account" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(screen.getByText("Please confirm your password")).toBeInTheDocument();
    });
  });

  it("validates name field correctly", async () => {
    render(<SignUpPage />);

    const nameInput = screen.getByLabelText("Name");

    // Test too short name
    fireEvent.change(nameInput, { target: { value: "A" } });
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name must be at least 2 characters")).toBeInTheDocument();
    });

    // Test valid name
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText("Name must be at least 2 characters")).not.toBeInTheDocument();
    });
  });

  it("validates email field correctly", async () => {
    render(<SignUpPage />);

    const emailInput = screen.getByLabelText("Email");

    // Test invalid email
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
    });

    // Test valid email
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText("Please enter a valid email")).not.toBeInTheDocument();
    });
  });

  it("validates password field correctly", async () => {
    render(<SignUpPage />);

    const passwordInput = screen.getByLabelText("Password");

    // Test too short password
    fireEvent.change(passwordInput, { target: { value: "weak" } });
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument();
    });

    // Test password without required characters
    fireEvent.change(passwordInput, { target: { value: "weakpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Password must include uppercase, lowercase, and number")).toBeInTheDocument();
    });

    // Test valid password
    fireEvent.change(passwordInput, { target: { value: "StrongPass123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText("Password must include uppercase, lowercase, and number")).not.toBeInTheDocument();
    });
  });

  it("validates password confirmation correctly", async () => {
    render(<SignUpPage />);

    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    // Set password
    fireEvent.change(passwordInput, { target: { value: "StrongPass123" } });

    // Test mismatched passwords
    fireEvent.change(confirmPasswordInput, { target: { value: "different" } });
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });

    // Test matching passwords
    fireEvent.change(confirmPasswordInput, { target: { value: "StrongPass123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText("Passwords do not match")).not.toBeInTheDocument();
    });
  });

  it("submits form successfully with valid data", async () => {
    render(<SignUpPage />);

    // Fill form with valid data
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "StrongPass123" } });

    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          password: "StrongPass123",
        }),
      });
    });

    // Check success message
    await waitFor(() => {
      expect(screen.getByText("Account created successfully! Please check your email for verification.")).toBeInTheDocument();
    });

    // Check form is cleared
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Password")).toHaveValue("");
    expect(screen.getByLabelText("Confirm Password")).toHaveValue("");
  });

  it("handles API errors correctly", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: () => Promise.resolve({
        errors: { email: "An account with this email already exists" }
      }),
    });

    render(<SignUpPage />);

    // Fill form
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "existing@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "StrongPass123" } });

    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("An account with this email already exists")).toBeInTheDocument();
    });
  });

  it("handles network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    render(<SignUpPage />);

    // Fill form
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "StrongPass123" } });

    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Network error. Please try again.")).toBeInTheDocument();
    });
  });

  it("handles social signup with GitHub", async () => {
    render(<SignUpPage />);

    const githubButton = screen.getByRole("button", { name: "Sign up with GitHub" });
    fireEvent.click(githubButton);

    expect(signIn).toHaveBeenCalledWith("github", { callbackUrl: "/" });
  });

  it("handles social signup with Google", async () => {
    render(<SignUpPage />);

    const googleButton = screen.getByRole("button", { name: "Sign up with Google" });
    fireEvent.click(googleButton);

    expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/" });
  });

  it("disables buttons during loading", async () => {
    // Mock slow response
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<SignUpPage />);

    // Fill form
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "StrongPass123" } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "StrongPass123" } });

    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Account" });
    fireEvent.click(submitButton);

    // Check buttons are disabled during loading
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Creating account...");

    expect(screen.getByRole("button", { name: "Sign up with GitHub" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sign up with Google" })).toBeDisabled();
  });
});