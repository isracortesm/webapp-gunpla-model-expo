import { FC } from "react";
import "./Footer.css";

export interface SocialNetworkItem {
  type: string;
  name: string;
  url: string;
}

interface FooterProps {
  socialNetworks?: SocialNetworkItem[];
}

const EXPLORA_LINKS = [
  { label: "Actividades", href: "/activities" },
  { label: "Noticias", href: "/news" },
];

const LEGAL_LINKS = [
  { label: "Plitica de privacidad", href: "/legal/privacy" },
  { label: "Terminos y condiciones", href: "/legal/terms" },
];

export const Footer: FC<FooterProps> = ({ socialNetworks }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Explora Column */}
        <div className="footer-column">
          <h3 className="footer-heading">Explora</h3>
          <ul className="footer-links-list">
            {EXPLORA_LINKS.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Community Column */}
        <div className="footer-column">
          <h3 className="footer-heading">Comunidad</h3>
          <ul className="footer-links-list">
            {socialNetworks && socialNetworks.length > 0 ? (
              socialNetworks.map((network, index) => (
                <li key={index}>
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    {network.name}
                  </a>
                </li>
              ))
            ) : (
              <>
                <li>
                  <a href="/community/facebook" className="footer-link">Facebook</a>
                </li>
                <li>
                  <a href="/community/instagram" className="footer-link">Instagram</a>
                </li>
                <li>
                  <a href="/community/tiktok" className="footer-link">TikTok</a>
                </li>
                <li>
                  <a href="/community/artstation" className="footer-link">ArtStation</a>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Legal Column */}
        <div className="footer-column">
          <h3 className="footer-heading">Legal</h3>
          <ul className="footer-links-list">
            {LEGAL_LINKS.map((link, linkIndex) => (
              <li key={linkIndex}>
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; 2026 Hobby City. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;