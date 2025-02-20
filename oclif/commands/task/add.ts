import { Command } from "@oclif/core";
import { apiRequest } from "../../../client/src/lib/queryClient";

export default class AddTask extends Command {
  static description = "Add a new task";

  static args = [
    { name: "title", required: true, description: "Task title" },
    { name: "description", required: false, description: "Task description" },
  ];

  static flags = {
    dueDate: Command.Flags.string({
      char: "d",
      description: "Due date (YYYY-MM-DD)",
    }),
  };

  async run() {
    const { args, flags } = await this.parse(AddTask);

    try {
      const response = await apiRequest("POST", "/api/tasks", {
        title: args.title,
        description: args.description,
        dueDate: flags.dueDate ? new Date(flags.dueDate) : undefined,
      });

      const task = await response.json();
      this.log(`Created task: ${task.title}`);
    } catch (error) {
      this.error("Failed to create task");
    }
  }
}