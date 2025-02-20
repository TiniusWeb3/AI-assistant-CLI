import { Task } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const { toast } = useToast();

  const toggleTask = async (task: Task) => {
    try {
      await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      
      toast({
        title: "Task updated",
        description: `"${task.title}" marked as ${!task.completed ? "completed" : "incomplete"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task)}
          />
          <div className="flex-1">
            <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
          </div>
          {task.dueDate && (
            <span className="text-sm text-muted-foreground">
              {format(new Date(task.dueDate), "PPP")}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
