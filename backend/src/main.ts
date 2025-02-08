import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import config from "../../env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [config.clientUrl],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
