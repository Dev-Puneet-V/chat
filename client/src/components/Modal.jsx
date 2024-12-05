const Modal = ({ children, handleModal, a }) => {
  console.log(handleModal, a);
  return (
    <div className="absolute w-[100vw] h-[100vh] top-0 bottom-0 left-0 right-0 z-50 flex justify-center items-center backdrop-blur-sm">
      <div className="relative bg-white min-h-[180px] w-[250px] rounded-xl">
        <div className="w-[100%] h-[30px]">
          <p
            className="font-bold absolute right-[10px] top-[10px] cursor-pointer "
            onClick={handleModal}
          >
            X
          </p>
        </div>
        <div className="p-[10px]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
