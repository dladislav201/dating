import "./GlobalNav.scss";
import Link from "next/link";

export const GlobalNav = () => {
  return (
    <nav className="globalnav">
      <div className="globalnav__island">
        <div className="globalnav__content">
          <Link href="/" className="globalnav__logo">
            ChatMe
          </Link>
          <ul className="globalnav__menu">
            <li className="globalnav__menu-item">
              <Link href="/profile" className="globalnav__menu-link">
                Профіль
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
