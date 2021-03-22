const Forbidden = ({ content }) => {
  return (
    <>
      <img src="/oops.png" alt="" width="200" className="mx-auto" />
      <p className="text-red-600 mt-16">{content}</p>
    </>
  );
};

export default Forbidden;
