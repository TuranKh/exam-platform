import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import config from "@shared/env";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    this.init();
  }

  init() {
    createClient(config.supabase.url, config.supabase.clientKey);
  }
}
