import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SupabaseService } from "./supabase/supabase.service";
import { UserExamsController } from "./user-exams/user-exams.controller";
import { UserExamsService } from "./user-exams/user-exams.service";

@Module({
  imports: [],
  controllers: [AppController, UserExamsController],
  providers: [AppService, SupabaseService, UserExamsService],
})
export class AppModule {}
