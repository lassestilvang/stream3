// app/auth/signin/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { Github, Chrome } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="max-w-md w-full space-y-8 p-8 bg-background rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Movie Tracker</h1>
          <p className="text-muted-foreground">Sign in to track your movies and TV shows</p>
        </div>
        
        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={() => signIn('github', { callbackUrl: '/' })}
            variant="outline"
          >
            <Github className="h-4 w-4 mr-2" />
            Sign in with GitHub
          </Button>
          
          <Button
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            variant="outline"
          >
            <Chrome className="h-4 w-4 mr-2" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}