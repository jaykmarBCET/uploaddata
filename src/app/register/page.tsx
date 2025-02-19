'use client';

import { useEffect, useState } from 'react';
import useAuthStore from '@/store/user';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, currentUser, user } = useAuthStore();

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ name, email, password });
    } catch (err) {
      console.log("error",err);
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    currentUser();
  }, [currentUser]);

  if (user?.email) {
    router.push('/');
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.3 }}
      >
        <Card className="w-96 p-6 shadow-lg">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? <PulseLoader color="#fff" size={8} /> : 'Register'}
              </Button>
            </form>
            <Link href={"/login"}>Already have an account</Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
