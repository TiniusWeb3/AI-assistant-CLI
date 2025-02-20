import { Command, Args } from "@oclif/core";
import { apiRequest } from "../../../client/src/lib/queryClient";

export default class NotionSync extends Command {
  static description = "Sync tasks with Notion database";

  static args = {
    database: Args.string({
      name: "database",
      required: true,
      description: "Notion database ID to sync with"
    })
  };

  async run() {
    const { args } = await this.parse(NotionSync);

    try {
      this.log("Starting Notion sync...");

      const response = await apiRequest(
        "POST", 
        `/api/sync/notion/${args.database}`
      );

      const result = await response.json();
      this.log(`✓ Synced ${result.count} tasks with Notion`);
    } catch (error) {
      this.error("Failed to sync with Notion. Please check your connection and authentication.");
    }
  }
}