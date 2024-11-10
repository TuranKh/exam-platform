import { supabase } from "@/supabase/init";

export default class StorageService {
  static async uploadFileToStorage(file: File, defaultStorage = "questions") {
    const { data, error } = await supabase.storage
      .from(defaultStorage)
      .upload(file.name, file, {
        cacheControl: "3600",
        upsert: false,
      });
  }
}
