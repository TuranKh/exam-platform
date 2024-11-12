import { supabase } from "@/supabase/init";

export default class StorageService {
  static async uploadFileToStorage(
    file: File,
    identifierPrefix: string,
    defaultStorage = "questions",
  ) {
    const { data } = await supabase.storage
      .from(defaultStorage)
      .upload(`${identifierPrefix}/${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    return data;
  }

  static async getFile(filePath: string) {
    const { data } = await supabase.storage
      .from("questions")
      .getPublicUrl(filePath);

    return data;
  }
}
