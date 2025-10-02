import { createClient } from "@/lib/supabase/client";

export class SupabaseStorage {
  private supabase = createClient();

  async uploadFile(file: File, bucket: string, path: string) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  async deleteFile(bucket: string, path: string) {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }

  getPublicUrl(bucket: string, path: string) {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  }

  async uploadProductImage(file: File, productId: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    await this.uploadFile(file, "tastyfruit-uploads", filePath);
    return this.getPublicUrl("tastyfruit-uploads", filePath);
  }

  async uploadRecipeImage(file: File, recipeId: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${recipeId}-${Date.now()}.${fileExt}`;
    const filePath = `recipes/${fileName}`;

    await this.uploadFile(file, "tastyfruit-uploads", filePath);
    return this.getPublicUrl("tastyfruit-uploads", filePath);
  }

  async uploadPublicationImage(file: File, publicationId: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${publicationId}-${Date.now()}.${fileExt}`;
    const filePath = `publications/${fileName}`;

    await this.uploadFile(file, "tastyfruit-uploads", filePath);
    return this.getPublicUrl("tastyfruit-uploads", filePath);
  }
}

export const storage = new SupabaseStorage();
