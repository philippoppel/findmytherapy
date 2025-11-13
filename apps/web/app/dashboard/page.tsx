import { redirect } from 'next/navigation'
import { auth } from '../../lib/auth'

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Redirect based on role to the correct dashboard
  if (session.user.role === 'THERAPIST') {
    redirect('/dashboard/therapist')
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin')
  }

  if (session.user.role === 'CLIENT') {
    redirect('/dashboard/client')
  }

  // Fallback for unknown roles
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-50 to-primary-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">
              Willkommen im Dashboard
            </h1>
            <p className="mt-2 text-neutral-600">
              Du bist erfolgreich eingeloggt! 🎉
            </p>
          </div>

          <div className="space-y-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              Deine Session-Daten
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-neutral-600">E-Mail</p>
                <p className="mt-1 text-lg font-semibold text-neutral-900">
                  {session.user.email}
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-neutral-600">Rolle</p>
                <p className="mt-1 text-lg font-semibold text-neutral-900">
                  {session.user.role}
                </p>
              </div>

              {session.user.firstName && (
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-neutral-600">Name</p>
                  <p className="mt-1 text-lg font-semibold text-neutral-900">
                    {session.user.firstName} {session.user.lastName}
                  </p>
                </div>
              )}

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-neutral-600">User ID</p>
                <p className="mt-1 text-sm font-mono text-neutral-900">
                  {session.user.id}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-sm font-semibold text-green-900">
                ✅ Login & Session-Persistenz funktioniert!
              </p>
              <p className="mt-1 text-sm text-green-700">
                Cookie wurde erfolgreich gesetzt und die Session ist aktiv.
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <a
              href="/"
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 transition"
            >
              Zur Homepage
            </a>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
