import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import config from "@shared/env";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService implements OnApplicationBootstrap {
  supabase: null | SupabaseClient = null;

  onApplicationBootstrap() {
    this.init();
  }

  init() {
    this.supabase = createClient(
      config.supabase.url,
      config.supabase.clientKey,
    );
  }
}
