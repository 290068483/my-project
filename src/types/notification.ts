export interface Notification {
  id: number;
  title: string;
  content: string;
  time: string;
  iconColor: string;
  iconPath: string;
  type: "critical" | "warning" | "success" | "info";
}