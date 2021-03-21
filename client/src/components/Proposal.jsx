const Proposal = ({ content }) => {
  return (
    <>
      {content.length ? (
        content.map((addr, index) => <p key={index}>{addr}</p>)
      ) : (
        <p className="mt-8 mb-8">
          Aucune proposition enregistrée dans le contrat
        </p>
      )}
    </>
  );
};

export default Proposal;
