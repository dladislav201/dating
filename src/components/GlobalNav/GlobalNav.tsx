import { Button } from "../Button/Button";
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
          <div className="globalnav__right">
            <ul className="globalnav__menu">
              <li className="globalnav__menu-item">
                <Link href="/users" className="globalnav__menu-link">
                  Users
                </Link>
              </li>
              <li className="globalnav__menu-item">
                <Link href="/profile" className="globalnav__menu-link">
                  Profile
                </Link>
              </li>
            </ul>
            <Button href="/login" variant="primary" size="small">
              log In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
