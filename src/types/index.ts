export interface Pageables {
  recordsPerPage: number;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  searchTerm: string | null;
  sort: "ASC" | "DESC";
}
