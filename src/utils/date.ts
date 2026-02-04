export const formatDateRange = (from: string, to: string): string =>
  `${new Date(from).toLocaleDateString()} — ${new Date(to).toLocaleDateString()}`;

export const formatDate = (value: string): string => new Date(value).toLocaleDateString();
