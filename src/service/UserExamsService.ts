import { supabase } from "@/supabase/init";

export default class UserExamsService {
  static async startExam({ examId, userId, deadline }) {
    const { data, error } = await supabase
      .from("user-exams")
      .insert([{ examId, userId, deadline }])
      .select();
  }
}
