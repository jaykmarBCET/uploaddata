import { useState, ChangeEvent } from 'react';
import useAuthStore from '@/store/user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Define the types for the props
interface CoverChangerProps {
  close: (value: boolean) => void; 
}

const CoverChanger: React.FC<CoverChangerProps> = ({ close }) => {
  const { user, cover } = useAuthStore();
  const [image, setImage] = useState<string | null>(null); // image can be a string or null
  const [preview, setPreview] = useState<string>(user?.cover || ''); // preview is always a string
  const [loading, setLoading] = useState(false);

  // Handle image file change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); 
        setImage(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle uploading of the image
  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    try {
      await cover(image); // Assuming cover is a function that takes the image as a parameter
    } catch (error) {
      console.error('Error updating cover:', error);
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
          <button className="btn px-2 py-1 font-semibold bg-[#99999922] rounded-lg" onClick={() => close(false)}>
            Close
          </button>
          <CardContent>
            <div className="flex justify-center mb-4">
              <Avatar>
                {preview ? (
                  <AvatarImage src={preview} alt="User Cover" />
                ) : (
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
            </div>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            <Button className="w-full mt-4" onClick={handleUpload} disabled={loading}>
              {loading ? <PulseLoader color="#fff" size={8} /> : 'Upload Cover'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CoverChanger;
