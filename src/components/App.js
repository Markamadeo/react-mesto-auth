import { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import ImagePopup from "./ImagePopup/ImagePopup";
import Main from "./Main/Main";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "../components/EditProfilePopup/EditProfilePopup";
import EditAvatarPopup from "../components/EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "../components/AddPlacePopup/AddPlacePopup";
import Login from "./Login/Login";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import NotFound from "./NotFound/NotFound";
import Register from "./Register/Register";
import InfoTooltip from "./InfoTooltip/InfoTooltip";

function App() {
  const [cards, setCards] = useState([]);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isPhotoViewerOpen, setIsPhotoViewer] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltip] = useState(true);
  const [isSuccessfully, setSuccessfully] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedCard, setSelectedCard] = useState({
    link: "#",
    name: "",
  });
  const [currentUser, setCurrentUser] = useState({
    name: "",
    about: "",
  });

  useEffect(() => {
    api.initialCards().then((dataCards) => {
      setCards(dataCards);
    });
  }, []);

  useEffect(() => {
    api.getUserInfo().then((data) => {
      setCurrentUser(data);
    });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
      setCards(newCards);
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then((newCard) => {
      const newCards = cards.filter((c) => (c._id === card._id ? newCard : c));
      setCards(newCards);
    });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardPhotoClick(card) {
    setIsPhotoViewer(true);
    setSelectedCard(card);
  }

  function handleUpdateUser(userInfo) {
    api.sendProfileInfo(userInfo).then((data) => {
      setCurrentUser(data);
    });
    closeAllPopups();
  }

  function handleUpdateAvatar(link) {
    api.changeAvatar(link).then((data) => {
      setCurrentUser(data);
    });
    closeAllPopups();
  }

  function handleAddPlaceSubmit(data) {
    api.sendNewCard(data).then((newCard) => {
      setCards([newCard, ...cards]);
    });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsPhotoViewer(false);
    setIsInfoTooltip(false);
    setSelectedCard({
      link: "#",
      name: "",
    });
  }
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <main className="page">
          <Header currentUser={currentUser} />
          <Switch>
            <ProtectedRoute
              path
              exact="/"
              loggedIn={loggedIn}
              component={Main}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onClickCard={handleCardPhotoClick}
            />
            {!loggedIn ? (
              <Route path="/signin">
                <Login name="login" title="Вход" buttonText="Войти" />
              </Route>
            ) : (
              <Redirect to="/" />
            )}
            {!loggedIn ? (
              <Route path="/signup">
                <Register
                  name="register"
                  title="Регистрация"
                  buttonText="Зарегистрироваться"
                />
              </Route>
            ) : (
              <Redirect to="/" />
            )}
            <Route>
              <NotFound />
            </Route>
          </Switch>
          {loggedIn && <Footer />}
        </main>

        <EditProfilePopup
          onUpdateUser={handleUpdateUser}
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
        />

        <EditAvatarPopup
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        />

        <AddPlacePopup
          onAddPlace={handleAddPlaceSubmit}
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
        />

        <ImagePopup
          isOpen={isPhotoViewerOpen}
          onClose={closeAllPopups}
          card={selectedCard}
        ></ImagePopup>

        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          successfully = {isSuccessfully}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
