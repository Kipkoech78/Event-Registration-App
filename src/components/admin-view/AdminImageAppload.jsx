const baseURL = import.meta.env.VITE_API_BASE_URL;
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";


function AdminImageUpload({
    setBannerImageFile,
    bannerImageFile,
    imageLoadingState,
    uploadedbannerImageUrl,
    setUploadedbannerImageUrl,
    setImageLoadingState,
    isEditMode,
    isCustomStyling = false,
  }) {
    const inputRef = useRef(null);
    //const [uploadedImageUrl, setUploadedImageUrl] = useState("");
   // const [imageLoadingState, setImageLoadingState] = useState(false)
  
    console.log(isEditMode, "isEditMode");
  
    function handleImageFileChange(event) {
      console.log(event.target.files, "event.target.files");
      const selectedFile = event.target.files?.[0];
      console.log(selectedFile);
  
      if (selectedFile) setBannerImageFile(selectedFile);
    }
  
    function handleDragOver(event) {
      event.preventDefault();
    }
  
    function handleDrop(event) {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile) setBannerImageFile(droppedFile);
    }
  
    function handleRemoveImage() {
      setBannerImageFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  
    async function uploadImageToCloudinary() {
      const data = new FormData();
      data.append("my_file", bannerImageFile);
      const response = await axios.post(
        `${baseURL}/api/upload-image`,
        data
      );
      console.log(response, "response banner Image");
  
      if (response?.data?.success) {
        setUploadedbannerImageUrl(response.data.results[0].url);
        setImageLoadingState(false);
      }
    }
  
    useEffect(() => {
      if (bannerImageFile !== null) uploadImageToCloudinary(bannerImageFile);
    }, [bannerImageFile]);
  
    return (
      <div
        className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
      >
        <Label className="text-lg font-semibold mb-2 block">Upload banner Image</Label>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`${
            isEditMode ? "opacity-60" : ""
          } border-2 border-dashed rounded-lg p-4`}
        >
          <Input
            id="event-image-upload"
            type="file"
            className="hidden"
            ref={inputRef}
            onChange={handleImageFileChange}
            // disabled={isEditMode}
          />
          {!bannerImageFile ? (
            <Label
              htmlFor="event-image-upload"
              className={`${
                isEditMode ? "cursor-not-allowed" : ""
              } flex flex-col items-center justify-center h-32 cursor-pointer`}
            >
              <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
              <span>Drag & drop or click to upload banner Image</span>
            </Label>
          ) : imageLoadingState ? (
            <Skeleton className="h-10 bg-gray-100" />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileIcon className="w-8 text-primary mr-2 h-8" />
              </div>
              <p className="text-sm font-medium">{bannerImageFile.name}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
export default AdminImageUpload;
