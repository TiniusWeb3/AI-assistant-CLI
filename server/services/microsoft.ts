import { MicrosoftTask } from "@shared/types";
import { authService } from "./auth";

export class MicrosoftService {
  private baseUrl = "https://graph.microsoft.com/v1.0";

  async getTasks(): Promise<MicrosoftTask[]> {
    const token = await authService.getToken("microsoft");
    if (!token) throw new Error("Not authenticated with Microsoft");

    const res = await fetch(`${this.baseUrl}/me/todo/lists/tasks`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        const newToken = await authService.refreshToken("microsoft");
        if (!newToken) throw new Error("Failed to refresh token");
        return this.getTasks();
      }
      throw new Error("Failed to fetch tasks from Microsoft");
    }

    const data = await res.json();
    return data.value.map((task: any): MicrosoftTask => ({
      id: task.id,
      title: task.title,
      description: task.body?.content,
      completed: task.status === "completed",
      dueDate: task.dueDateTime ? new Date(task.dueDateTime) : undefined,
    }));
  }

  async createTask(task: Partial<MicrosoftTask>): Promise<MicrosoftTask> {
    const token = await authService.getToken("microsoft");
    if (!token) throw new Error("Not authenticated with Microsoft");

    const res = await fetch(`${this.baseUrl}/me/todo/lists/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.title,
        body: task.description ? {
          content: task.description,
          contentType: "text",
        } : undefined,
        dueDateTime: task.dueDate?.toISOString(),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create task in Microsoft");
    }

    const data = await res.json();
    return {
      id: data.id,
      title: data.title,
      description: data.body?.content,
      completed: data.status === "completed",
      dueDate: data.dueDateTime ? new Date(data.dueDateTime) : undefined,
    };
  }
}

export const microsoftService = new MicrosoftService();
