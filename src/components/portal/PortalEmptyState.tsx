import { PortalIcon, PortalIconName } from "./PortalIcons";
import styles from "./PortalEmptyState.module.css";

type Props = {
  icon?: PortalIconName;
  title?: string;
  note?: string;
};

// Shared "nothing here yet" panel content — used across the client, admin
// and (future) professional portals so every empty state reads the same way.
export function PortalEmptyState({ icon = "file", title = "Not available", note }: Props) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon}><PortalIcon name={icon} size={18} /></span>
      <strong>{title}</strong>
      {note ? <span>{note}</span> : null}
    </div>
  );
}
