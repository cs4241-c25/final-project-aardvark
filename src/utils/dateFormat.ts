export function getDateString() {
  const today = new Date();
  const date = new Date(today.getTime() - 5 * 60 * 60 * 1000);

  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}
