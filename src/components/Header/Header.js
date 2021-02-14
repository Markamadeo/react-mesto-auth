import { Link, Switch } from "react-router-dom";
import logo from "../../images/header__logo.svg";

function Header(props) {
  return (
    <section className="header header_shift_down header_shift_up">
      <img src={logo} alt="Логотип" className="header__logo" />
      <Switch>
        <Link className='header__link' path="/signin" to="/signup">
          <p>Регистрация</p>
        </Link>
        <Link className='header__link' path="/signup" to="/signin">
          <p>Войти</p>
        </Link>
      </Switch>
    </section>
  );
}

export default Header;
