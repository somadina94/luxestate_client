"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { propertyService } from "@/services";
import { AuthState, RootState, useAppSelector } from "@/store";
import { toast } from "sonner";
import { UploadIcon } from "lucide-react";
import IconButton from "../atoms/IconButton";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
export default function AddImage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = useParams();
  const propertyId = Array.isArray(id) ? id[0] : id;
  const { access_token } = useAppSelector(
    (state: RootState) => state.auth as AuthState,
  );
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageUpload = async () => {
    setIsLoading(true);
    if (!selectedFiles.length) {
      toast.error("Please select at least one image");
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("alt_text", "Image of the property");
    formData.append("is_primary", "false");
    formData.append("order_index", "0");
    if (!propertyId) {
      toast.error("Invalid property id");
      setIsLoading(false);
      return;
    }
    const res = await propertyService.uploadPhoto(
      propertyId,
      formData,
      access_token || "",
    );
    if (res.status === 200 || res.status === 201) {
      toast.success(
        selectedFiles.length === 1
          ? "Image uploaded successfully"
          : `${selectedFiles.length} images uploaded successfully`,
      );
      router.back();
    } else {
      const detail = (res.data as { detail?: string | Array<{ msg?: string }> })
        ?.detail;
      const message = Array.isArray(detail)
        ? detail
            .map((d) => d.msg)
            .filter(Boolean)
            .join(", ") || "Failed to upload image"
        : (detail as string) ||
          (res as { message?: string }).message ||
          "Failed to upload image";
      toast.error(message);
    }
    setIsLoading(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Add Property Images</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {previewUrls.length > 0 ? (
          previewUrls.map((url, index) => (
            <Image
              key={url}
              src={url}
              alt={`Selected property image ${index + 1}`}
              width={800}
              height={600}
              className="h-48 w-full rounded-lg object-cover"
            />
          ))
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1760434875920-2b7a79ea163a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Add property images"
            width={800}
            height={600}
            className="h-64 w-full rounded-lg object-cover sm:col-span-2"
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Input
          type="file"
          multiple
          onChange={handleImageSelect}
          accept="image/*"
          className="w-full"
        />
        <IconButton
          title={selectedFiles.length > 1 ? "Upload Images" : "Upload Image"}
          Icon={UploadIcon}
          onClick={handleImageUpload}
          className="w-full"
          disabled={isLoading}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
}
