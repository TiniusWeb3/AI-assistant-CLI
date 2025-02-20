import { Client } from "@notionhq/client";
import { NotionTask, NotionDatabase } from "@shared/types";
import { authService } from "./auth";
import type { DatabaseObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export class NotionService {
  private client: Client | null = null;

  private async getClient() {
    const token = await authService.getToken("notion");
    if (!token) throw new Error("Not authenticated with Notion");

    if (!this.client) {
      this.client = new Client({ auth: token.accessToken });
    }
    return this.client;
  }

  async getDatabases(): Promise<NotionDatabase[]> {
    const client = await this.getClient();

    try {
      const response = await client.search({
        filter: { property: "object", value: "database" }
      });

      return response.results
        .filter((result): result is DatabaseObjectResponse => result.object === "database")
        .map(db => ({
          id: db.id,
          title: db.title?.[0]?.plain_text || "Untitled",
          url: db.url
        }));
    } catch (error) {
      if (error instanceof Error && error.name === "APIResponseError" && error.status === 401) {
        const newToken = await authService.refreshToken("notion");
        if (!newToken) throw new Error("Failed to refresh token");
        this.client = null;
        return this.getDatabases();
      }
      throw new Error("Failed to fetch Notion databases");
    }
  }

  async getTasks(databaseId: string): Promise<NotionTask[]> {
    const client = await this.getClient();

    try {
      const response = await client.databases.query({
        database_id: databaseId,
        sorts: [{ property: "last_edited_time", direction: "descending" }]
      });

      return response.results
        .filter((page): page is PageObjectResponse => page.object === "page")
        .map(page => {
          const properties = page.properties;
          return {
            id: page.id,
            title: properties.Name?.type === "title" 
              ? properties.Name.title[0]?.plain_text || "Untitled"
              : "Untitled",
            description: properties.Description?.type === "rich_text"
              ? properties.Description.rich_text[0]?.plain_text
              : undefined,
            completed: properties.Status?.type === "status"
              ? properties.Status.status?.name === "Done"
              : false,
            dueDate: properties.DueDate?.type === "date"
              ? properties.DueDate.date?.start
                ? new Date(properties.DueDate.date.start)
                : undefined
              : undefined,
            url: page.url,
            lastEdited: new Date(page.last_edited_time)
          };
        });
    } catch (error) {
      if (error instanceof Error && error.name === "APIResponseError" && error.status === 401) {
        const newToken = await authService.refreshToken("notion");
        if (!newToken) throw new Error("Failed to refresh token");
        this.client = null;
        return this.getTasks(databaseId);
      }
      throw new Error("Failed to fetch tasks from Notion");
    }
  }

  async createTask(databaseId: string, task: Partial<NotionTask>): Promise<NotionTask> {
    const client = await this.getClient();

    try {
      const response = await client.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [{ text: { content: task.title || "Untitled" } }]
          },
          ...(task.description && {
            Description: {
              rich_text: [{ text: { content: task.description } }]
            }
          }),
          Status: {
            status: { name: task.completed ? "Done" : "Not Started" }
          },
          ...(task.dueDate && {
            DueDate: {
              date: { start: task.dueDate.toISOString() }
            }
          })
        }
      });

      if (response.object !== "page") {
        throw new Error("Invalid response from Notion API");
      }

      return {
        id: response.id,
        title: task.title || "Untitled",
        description: task.description,
        completed: task.completed || false,
        dueDate: task.dueDate,
        url: response.url,
        lastEdited: new Date(response.last_edited_time)
      };
    } catch (error) {
      throw new Error("Failed to create task in Notion");
    }
  }
}

export const notionService = new NotionService();