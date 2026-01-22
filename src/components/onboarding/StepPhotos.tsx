import { useState, useRef } from "react";
import { ProfileFormData } from "@/hooks/useProfile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getUserFriendlyError } from "@/lib/errorHandler";
import { Camera, Plus, X, Image as ImageIcon, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepPhotosProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  uploadPhoto: (file: File) => Promise<{ error: Error | null; url: string | null }>;
}

const MAX_PHOTOS = 5;
const MIN_PHOTOS = 2;

export default function StepPhotos({ formData, setFormData, uploadPhoto }: StepPhotosProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type - check both MIME type and extension
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!file.type.startsWith("image/") || !fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Verify file is actually an image by loading it
    const isValidImage = await new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });

    if (!isValidImage) {
      toast({
        title: "Invalid image",
        description: "The file appears to be corrupted or not a valid image.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const { error, url } = await uploadPhoto(file);

    if (error) {
      toast({
        title: "Upload failed",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } else if (url) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, url],
      }));
      toast({
        title: "Photo uploaded!",
        description: "Your photo has been added to your profile.",
      });
    }

    setUploading(false);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const setAsPrimary = (index: number) => {
    if (index === 0) return;
    
    setFormData(prev => {
      const newPhotos = [...prev.photos];
      const [photo] = newPhotos.splice(index, 1);
      newPhotos.unshift(photo);
      return { ...prev, photos: newPhotos };
    });

    toast({
      title: "Primary photo updated",
      description: "This photo will be shown first on your profile.",
    });
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Guidelines */}
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
        <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          Photo Guidelines
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Add {MIN_PHOTOS}-{MAX_PHOTOS} clear photos showing your face</li>
          <li>• Use well-lit, recent photos</li>
          <li>• Your first photo will be your main profile picture</li>
          <li>• No group photos as your primary image</li>
        </ul>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Existing photos */}
        {formData.photos.map((photo, index) => (
          <div
            key={photo}
            className={cn(
              "relative aspect-square rounded-xl overflow-hidden border-2 group",
              index === 0 ? "border-primary" : "border-border"
            )}
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Primary badge */}
            {index === 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full flex items-center gap-1">
                <Star className="h-3 w-3" />
                Primary
              </div>
            )}

            {/* Hover actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {index !== 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setAsPrimary(index)}
                  className="h-8 text-xs"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Primary
                </Button>
              )}
              <Button
                size="icon"
                variant="destructive"
                onClick={() => removePhoto(index)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add photo button */}
        {formData.photos.length < MAX_PHOTOS && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed border-border",
              "flex flex-col items-center justify-center gap-2",
              "text-muted-foreground hover:text-primary hover:border-primary",
              "transition-colors cursor-pointer",
              uploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {uploading ? (
              <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="h-6 w-6" />
                <span className="text-xs">Add Photo</span>
              </>
            )}
          </button>
        )}

        {/* Empty slots */}
        {Array.from({ length: Math.max(0, MIN_PHOTOS - formData.photos.length - 1) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="aspect-square rounded-xl border-2 border-dashed border-border/50 flex items-center justify-center"
          >
            <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
          </div>
        ))}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Photo count */}
      <p className="text-sm text-muted-foreground text-center">
        {formData.photos.length} of {MAX_PHOTOS} photos added
        {formData.photos.length < MIN_PHOTOS && (
          <span className="text-destructive ml-2">
            (minimum {MIN_PHOTOS} required)
          </span>
        )}
      </p>
    </Card>
  );
}
