import { Controller, Post, Body, Get } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import * as webpush from "web-push";
import { PushSubscription } from "web-push";

const subscriptions: PushSubscription[] = [];

@Controller("notification")
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post("subscribe")
    subscribe(@Body() body) {
        subscriptions.push(body);
        return { ok: true };
    }

    @Post("notify")
    notify() {
        subscriptions.forEach(sub => {
            webpush
                .sendNotification(
                    sub,
                    JSON.stringify({
                        title: "Notificação",
                        body: "Funciona com o navegador fechado",
                    })
                )
                .catch(err => console.error("Error sending notification:", err));
        });

        return { sent: true };
    }

    @Get("subscriptions")
    getSubscriptions() {
        return subscriptions;
    }
}
