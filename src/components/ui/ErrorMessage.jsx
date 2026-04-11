const ErrorMessage = ({ message }) => {
  return (
    <div className="text-red-500 text-center p-4">
      {message || "Something went wrong"}
    </div>
  );
};

export default ErrorMessage;