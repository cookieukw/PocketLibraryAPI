import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "com.cookie.bpocket",
    appName: "PocketLibrary",
    webDir: "build",
    server: {
        androidScheme: "https"
    }
};

export default config;
