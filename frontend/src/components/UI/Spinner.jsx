export const Spinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="spinner-wrapper flex-center btn-w-full btn-h-full">
      <div className="spinner" />
      <span>Загрузка...</span>
    </div>
  );
};
