import { Command, Flags } from "@oclif/command";
import { apiRequest } from "../../../client/src/lib/queryClient";

export default class AddEvent extends Command {
  static description = "Add a new calendar event";

  static args = [
    { name: "title", required: true, description: "Event title" },
    { name: "description", required: false, description: "Event description" },
  ];

  static flags = {
    start: Flags.string({
      char: "s",
      required: true,
      description: "Start time (YYYY-MM-DD HH:mm)",
    }),
    end: Flags.string({
      char: "e",
      required: true,
      description: "End time (YYYY-MM-DD HH:mm)",
    }),
  };

  async run() {
    const { args, flags } = this.parse(AddEvent);

    try {
      const response = await apiRequest("POST", "/api/events", {
        title: args.title,
        description: args.description,
        startTime: new Date(flags.start),
        endTime: new Date(flags.end),
      });

      const event = await response.json();
      this.log(`Created event: ${event.title}`);
      this.log(`Start: ${new Date(flags.start).toLocaleString()}`);
      this.log(`End: ${new Date(flags.end).toLocaleString()}`);
    } catch (error) {
      this.error("Failed to create event");
    }
  }
}