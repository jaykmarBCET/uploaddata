'use client';

import React, { useState } from 'react';
import useAuthStore from '@/store/user';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { PulseLoader } from 'react-spinners';
import {useRouter} from 'next/navigation'


const Add = () => {
  const { add,user } = useAuthStore();
  const [data, setData] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('image');
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(String(reader.result) ); // Base64 encoding
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!data || !message) return;
    setLoading(true);
    try {
      await add({ data, message, type });
    } catch (error) {
      console.error('Error adding data:', error);
    } finally {
      setLoading(false);
    }
  };
  if(!user?.email){
    router.push('/login')
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent className="flex flex-col gap-4">
          <Input type="file" accept="image/*,video/*" onChange={handleFileChange} />
          <Input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <Select onValueChange={setType} value={type}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <PulseLoader color="#fff" size={8} /> : 'Add Data'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Add;
