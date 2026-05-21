export default function RoomsLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
        aria-label="Loading rooms"
      />
    </div>
  );
}
