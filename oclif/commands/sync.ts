import { Command } from "@oclif/command";
import { apiRequest } from "../../client/src/lib/queryClient";

export default class Sync extends Command {
  static description = "Sync tasks and events with Microsoft To Do and Google Calendar";

  async run() {
    this.log("Starting sync...");

    try {
      // Sync Microsoft Tasks
      this.log("Syncing tasks with Microsoft To Do...");
      await apiRequest("POST", "/api/sync/microsoft");
      this.log("✓ Tasks synced successfully");

      // Sync Google Calendar
      this.log("Syncing events with Google Calendar...");
      await apiRequest("POST", "/api/sync/google");
      this.log("✓ Events synced successfully");

      this.log("\nSync completed successfully!");
    } catch (error) {
      this.error("Sync failed. Please check your connection and try again.");
    }
  }
}
