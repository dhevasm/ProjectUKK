import React, { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/Components/ui/avatar';

import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner'

export default function UpdateProfileImage() {
  const { auth } = usePage().props;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data, setData, post, processing, errors } = useForm({
    picture: null as File | null
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
       toast.warning('Invalid file type.', {
            description : 'The selected file must be a JPG, PNG, or GIF image.',
        });
        return;
      }

      if (file.size > maxSize) {
        toast.warning('File too large.', {
            description : 'The selected file must be less than 5MB.',
        });
        return;
      }

      setData('picture', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.picture) {
        toast.warning('No image selected.', {
                description : 'Please select an image to upload.',
            });
      return;
    }

    post(route('profile.change-avatar'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Profile image updated.', {
            description : 'Your profile image has been updated successfully.',
        });
        setImagePreview(null);
      },
      onError: (errors) => {
        toast.error("Failed to update profile image", {
            description: "An error occurred : " + Object.values(errors)[0],
        });
    }
    });
  };


  return (
    <div className="max-w-md mx-auto">
        <h1 className='text-2xl font-bold'>Update Profile Picture</h1>
        <p>
          Choose a new profile image. Max size: 5MB
        </p>
      <div className='py-5'>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <Avatar className="w-32 h-32 cursor-pointer" onClick={() => document.getElementById('picture')?.click()}>
                {
                    imagePreview ?
                    <AvatarImage
                    src={ imagePreview }
                    alt="Profile Picture"
                    className='object-cover'
                    /> :
                    auth.user.image ?
                    <AvatarImage
                        src={
                            auth.user.image
                        }
                        alt="Profile Picture"
                        className='object-cover'
                    /> : ""
                }
              <AvatarFallback className='text-4xl  cursor-pointer' onClick={() => document.getElementById('picture')?.click()}>
                {auth.user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Upload Image</Label>
            <Input
              id="picture"
              name="picture"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleImageChange}
              className="w-full"
            />
            {errors.picture && (
              <p className="text-red-500 text-sm">{errors.picture}</p>
            )}
          </div>

          <Button
            type="submit"
            variant={'theme'}
            className="w-full"
            disabled={processing || !data.picture}
          >
            {processing ? 'Updating...' : 'Update Profile Picture'}
          </Button>
        </form>
      </div>
    </div>
  );
}
