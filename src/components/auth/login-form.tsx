// src/components/auth/login-form.tsx
'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {auth} from '@/lib/firebase';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const {toast} = useToast();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        setIsSigningUp(true);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
          const avatarUrl = `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(
            user.email || ''
          )}`;
          await updateProfile(user, {photoURL: avatarUrl});
        }
      }
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
        <CardDescription>
          {isLogin
            ? 'Enter your credentials to access your dashboard.'
            : 'Create an account to get started.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
              disabled={isSigningUp}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isSigningUp}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSigningUp}>
            {isSigningUp ? 'Creating Account...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="p-1"  disabled={isSigningUp}>
            {isLogin ? 'Sign up' : 'Login'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
