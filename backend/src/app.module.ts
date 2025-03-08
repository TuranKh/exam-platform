import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SupabaseService } from "./supabase/supabase.service";
import { ExamsController } from "./exam/user-exams.controller";
import { ExamsService } from "./exam/user-exams.service";

@Module({
  imports: [],
  controllers: [AppController, ExamsController],
  providers: [AppService, SupabaseService, ExamsService],
})
export class AppModule {}
