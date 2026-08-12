const ACTIVITY_COLLABORATOR_ROLES_KEY = 'activity_collaborator_roles';

function readRoles(): Record<string, string> {
  try {
    const raw = localStorage.getItem(ACTIVITY_COLLABORATOR_ROLES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeRoles(roles: Record<string, string>): void {
  try {
    localStorage.setItem(ACTIVITY_COLLABORATOR_ROLES_KEY, JSON.stringify(roles));
  } catch {
    // ignore
  }
}

export function getStoredActivityCollaboratorRole(documentId: string): string | null {
  return readRoles()[documentId] ?? null;
}

export function storeActivityCollaboratorRole(documentId: string, role: string): void {
  const roles = readRoles();
  roles[documentId] = role;
  writeRoles(roles);
}

export function clearActivityCollaboratorRole(documentId: string): void {
  const roles = readRoles();
  if (!(documentId in roles)) return;
  delete roles[documentId];
  writeRoles(roles);
}
