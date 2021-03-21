const VotersAddress = ({ content }) => {
  return (
    <>
      {content.length ? (
        content.map((addr, index) => <p key={index}>{addr}</p>)
      ) : (
        <p className="mt-8 mb-8">
          Aucune adresses n'est enregistrées pour le moment
        </p>
      )}
    </>
  );
};

export default VotersAddress;
