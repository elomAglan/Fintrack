import React, { useState } from 'react';
import { auth } from '../config/firebaseConfig'; // Importer auth
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

// Objet de traduction pour les langues disponibles
const translations = {
  français: {
    title: "Paramètres",
    notifications: "Recevoir des notifications",
    languageLabel: "Langue de l'application",
    changePassword: "Changer le mot de passe",
    oldPassword: "Ancien mot de passe",
    newPassword: "Nouveau mot de passe",
    confirmChangePassword: "Confirmer le changement de mot de passe",
    passwordSuccess: "Le mot de passe a été changé avec succès.",
    passwordError: "Erreur lors de la vérification du mot de passe. Veuillez réessayer.",
    enterPassword: "Veuillez entrer l'ancien et le nouveau mot de passe."
  },
  anglais: {
    title: "Settings",
    notifications: "Receive notifications",
    languageLabel: "Application Language",
    changePassword: "Change Password",
    oldPassword: "Old Password",
    newPassword: "New Password",
    confirmChangePassword: "Confirm Password Change",
    passwordSuccess: "Password changed successfully.",
    passwordError: "Error verifying password. Please try again.",
    enterPassword: "Please enter the old and new password."
  }
};

const Parametre = () => {
  const [notifications, setNotifications] = useState(true);
  const [langue, setLangue] = useState('français'); // Langue par défaut : français
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fonction pour activer/désactiver les notifications
  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  // Fonction pour changer le mot de passe
  const handlePasswordChange = async () => {
    const user = auth.currentUser;
    if (!oldPassword || !newPassword) {
      setError(translations[langue].enterPassword);
      return;
    }

    if (user) {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setSuccess(translations[langue].passwordSuccess);
        setError(null);
        setOldPassword('');
        setNewPassword('');
        setIsChangingPassword(false); // Fermer le formulaire après succès
      } catch (err) {
        setError(translations[langue].passwordError);
        setSuccess(null);
      }
    } else {
      setError("Utilisateur non connecté.");
    }
  };

  return (
    <div className="container mx-auto p-4 pt-24">
      <h1 className="text-2xl font-bold mb-4">{translations[langue].title}</h1>

      {/* Notifications */}
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={notifications}
            onChange={toggleNotifications}
            className="mr-2"
          />
          {translations[langue].notifications}
        </label>
      </div>

      {/* Changer la langue */}
      <div className="mb-4">
        <label className="block mb-2">{translations[langue].languageLabel}</label>
        <select
          value={langue}
          onChange={(e) => setLangue(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="français">Français</option>
          <option value="anglais">Anglais</option>
        </select>
      </div>

      {/* Bouton pour afficher le formulaire de changement de mot de passe */}
      <div>
        {!isChangingPassword ? (
          <button
            onClick={() => setIsChangingPassword(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {translations[langue].changePassword}
          </button>
        ) : (
          <div className="mt-4">
            <label className="block mb-2">{translations[langue].oldPassword}</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full mb-4"
            />

            <label className="block mb-2">{translations[langue].newPassword}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full mb-4"
            />

            {/* Affichage des erreurs ou des succès */}
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}

            {/* Bouton de soumission */}
            <button
              onClick={handlePasswordChange}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {translations[langue].confirmChangePassword}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Parametre;
