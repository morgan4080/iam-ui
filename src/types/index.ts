export interface Pageables {
  recordsPerPage: number;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  searchTerm: string | null;
  sort: string;
  order: "ASC" | "DESC";
  startDate: string | null;
  endDate: string | null;
}

export interface Notification {
  message: string | null;
  success?: boolean;
  warning?: boolean;
  error?: boolean;
}
