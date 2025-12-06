export const formatDateRange = (from: string, to: string): string =>
  `${new Date(from).toLocaleDateString()} — ${new Date(to).toLocaleDateString()}`;
