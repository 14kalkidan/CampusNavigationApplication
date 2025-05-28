import authApi from "./authAPI";

interface GalleryImage {
  id: number;
  image: string;
  place: string;
  comment: string;
  approved: boolean;
  created_at: string;
  uploaded_by: number;
}

export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const response = await authApi.get("/gallery/");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 
                    error.response?.data?.message || 
                    error.message || 
                    "Failed to fetch gallery images";
    console.error("Fetch gallery images error:", error.response?.data || error.message);
    throw new Error(message);
  }
};

export const uploadGalleryImage = async (
  file: { uri: string; name: string; type: string },
  place: string,
  comment: string
): Promise<GalleryImage> => {
  try {
    const formData = new FormData();
    
    formData.append("image", {
      uri: file.uri,
      name: file.name,
      type: file.type
    });
    
    formData.append("place", place);
    formData.append("comment", comment);

    const response = await authApi.post("/gallery/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error || 
                    error.response?.data?.message || 
                    error.message || 
                    "Failed to upload gallery image";
    console.error("Upload gallery image error:", error.response?.data || error.message);
    throw new Error(message);
  }
};