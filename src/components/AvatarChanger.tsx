
import useAuthStore from '@/store/user';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const AvatarChanger = ({close}) => {
  const { user, avatar } = useAuthStore();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    try {
      await avatar(image);
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-96 p-6 shadow-lg">
          <button className='btn px-2 py-1 font-semibold bg-[#99999922] rounded-lg' onClick={()=>close(false)}>Close</button>
          <CardContent>
            <div className="flex justify-center mb-4">
              <Avatar>
                <AvatarImage src={preview} alt="User Avatar" />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            <Button className="w-full mt-4" onClick={handleUpload} disabled={loading}>
              {loading ? <PulseLoader color="#fff" size={8} /> : 'Upload Avatar'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AvatarChanger;
