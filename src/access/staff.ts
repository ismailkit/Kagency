type UserLike = {
  role?: 'admin' | 'editor' | null
} | null | undefined

function isStaffUser(user: UserLike) {
  return user?.role === 'admin' || user?.role === 'editor'
}

export function canManageContent({ req }: { req: { user?: UserLike } }) {
  return isStaffUser(req.user)
}

export function canManageSubmissions({ req }: { req: { user?: UserLike } }) {
  return Boolean(req.user)
}