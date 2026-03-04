import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { get } from "env-var";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as webpush from "web-push";

async function bootstrap() {
    console.log("🚀 API is running on PORT:", get("PORT").asString() ?? 5000);

    const app = await NestFactory.create(AppModule, {
        snapshot: get("ENVIRONMENT").required().asString() != "production",
    });

    app.use(bodyParser.json({ limit: "20mb" }));
    app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

    app.setGlobalPrefix("api");

    app.use(cookieParser());

    app.enableCors({
        origin: get("FRONTEND_URL").required().asString(),
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        })
    );

    webpush.setVapidDetails(
        "mailto:test@test.com",
        get("VAPID_PUBLIC_KEY").required().asString(),
        get("VAPID_PRIVATE_KEY").required().asString()
    );

    await app.listen(get("PORT").required().asString() ?? 5000);
}
void bootstrap();
