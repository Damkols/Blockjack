interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="px-20 py-10 bg-blue-600 min-h-screen text-white">
      {children}
    </div>
  );
};

export default Container;
