// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Server-side validation
    const errors: {[key: string]: string} = {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!email || typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = "Password must include uppercase, lowercase, and number";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { errors: { email: "An account with this email already exists" } },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate user ID
    const userId = crypto.randomUUID();

    console.log("Creating user with values:", {
      id: userId,
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
      })
      .returning({ id: users.id });

    // Generate verification token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(verificationTokens).values({
      identifier: email.trim(),
      token,
      expires,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email.trim(), token);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't fail the signup if email fails, but log it
    }

    return NextResponse.json(
      { message: "Account created. Please check your email for verification." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}