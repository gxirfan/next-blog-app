export const getMinAgeDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${day}-${month}`;
};
