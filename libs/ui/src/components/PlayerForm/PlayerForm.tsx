import React, { FC, useState } from 'react';

interface PlayerFormProps {
  callback: (playerName: string) => Promise<Response>;
}

const PlayerForm: FC<PlayerFormProps> = (props) => {
  const { callback } = props;
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setPlayerName("");
    setError("");
  };

  return (
    <form
      data-testid="PlayerForm"
      className="flex flex-col justify-center mb-4 gap-4 p-2 border border-gray-300 rounded-md"
      onSubmit={async (evt) => {
        evt.preventDefault();
        setError("");
        const trimmed = playerName.trim();
        if (!trimmed) {
          setError("Le nom du joueur ne peut pas être vide");
          return;
        }
        setLoading(true);
        try {
          const res = await callback(trimmed);
          if (res.ok) {
            resetForm();
          } else if (res.status === 409) {
            setError("Ce joueur existe déjà");
          } else if (res.status === 400) {
            setError("ID invalide");
          } else {
            setError("Une erreur serveur est survenue");
          }
        } catch (err) {
          setError("Impossible de contacter le serveur");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }}
    >
      <span className="text-xl">Nom du joueur</span>
      <input
        type="text"
        className="border border-gray-300 rounded-md"
        value={playerName}
        onChange={(evt) => setPlayerName(evt.target.value)}
        disabled={loading}
      />
      {error && <span className="text-red-600 text-sm">{error}</span>}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Création..." : "Déclarer le joueur"}
      </button>
    </form>
  );
};

export default PlayerForm;
