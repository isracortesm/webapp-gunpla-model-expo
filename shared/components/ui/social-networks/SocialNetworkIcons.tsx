import { FC } from "react";
import "./SocialNetworkIcons.css";
import { siFacebook, siInstagram, siTiktok, siPinterest, siArtstation, siLinktree, siWordpress } from "simple-icons";
import { SocialNetworkItem } from "@/domain/entities/event-dashboard/entity";



interface SocialNetworkIconsProps {
  networks: SocialNetworkItem[];
}

// Map network types to simple-icons SVG strings (rendered via dangerouslySetInnerHTML)
const ICON_MAP: Record<string, string> = {
  facebook: siFacebook.svg,
  instagram: siInstagram.svg,
  itktok: siTiktok.svg,
  pinterest: siPinterest.svg,
  artstation: siArtstation.svg,
  linktree: siLinktree.svg,
  web: siWordpress.svg,
};

const IconSvgWrapper = ({ svgString }: { svgString: string }) => (
  <span dangerouslySetInnerHTML={{ __html: svgString }} />
);

export const SocialNetworkIcons: FC<SocialNetworkIconsProps> = ({ networks }) => {
  if (!networks || networks.length === 0) return null;

  return (
    <div className="social-network-icons-container">
      {networks.map((network, index) => {
        const Icon = ICON_MAP[network.type];

        if (!Icon) {
          // Fallback: render a generic link with the network name
          return (
            <a
              key={index}
              href={network.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-network-icon-link fallback"
              title={network.name}
            >
              {network.name.charAt(0).toUpperCase()}
            </a>
          );
        }

        return (
          <a
            key={index}
            href={network.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-network-icon-link"
            title={network.name}
          >
            <IconSvgWrapper svgString={Icon} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialNetworkIcons;