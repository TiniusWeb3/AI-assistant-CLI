import { Command, Flags } from "@oclif/command";
import { apiRequest } from "../../../client/src/lib/queryClient";
import { Task } from "@shared/schema";

export default class ListTasks extends Command {
  static description = "List all tasks";

  static flags = {
    completed: Flags.boolean({
      char: "c",
      description: "Show only completed tasks",
    }),
    pending: Flags.boolean({
      char: "p",
      description: "Show only pending tasks",
    }),
  };

  async run() {
    try {
      const response = await apiRequest("GET", "/api/tasks");
      const tasks: Task[] = await response.json();

      const { flags } = this.parse(ListTasks);
      let filteredTasks = tasks;

      if (flags.completed) {
        filteredTasks = tasks.filter((t) => t.completed);
      } else if (flags.pending) {
        filteredTasks = tasks.filter((t) => !t.completed);
      }

      filteredTasks.forEach((task) => {
        const status = task.completed ? "[✓]" : "[ ]";
        const dueDate = task.dueDate
          ? `(due: ${new Date(task.dueDate).toLocaleDateString()})`
          : "";

        this.log(`${status} ${task.title} ${dueDate}`);
        if (task.description) {
          this.log(`    ${task.description}`);
        }
      });

      this.log(`\nTotal: ${filteredTasks.length} tasks`);
    } catch (error) {
      this.error("Failed to fetch tasks");
    }
  }
}