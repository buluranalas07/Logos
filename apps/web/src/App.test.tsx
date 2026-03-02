import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { App } from './App'

// Mock firebase — export every symbol the app imports so no "missing export" errors
vi.mock('./firebase', () => ({
  app: {},
  auth: {},
  authReady: Promise.resolve(),
  chatCallable: vi.fn(),
  ingestCallable: vi.fn(),
}))

// Mock firebase/firestore so pages that call getFirestore(app) at module level don't throw
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
  setDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => null),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
}))

// Mock AuthProvider so tests don't need real Firebase Auth / Firestore
vi.mock('./providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: vi.fn(() => ({
    user: { uid: 'test-uid', displayName: 'Test User', email: 'test@test.com' },
    userProfile: { uid: 'test-uid', onboardingComplete: true },
    loading: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    setUserProfile: vi.fn(),
    refreshUserProfile: vi.fn(),
  })),
}))

// Mock tRPC so TodayPage/BiblePage/DiaryPage don't need a real provider
vi.mock('./lib/trpc', () => ({
  trpc: {
    bible: {
      getVOTD: {
        useQuery: vi.fn(() => ({ data: undefined, isLoading: true, isError: false })),
      },
      getDailyPrayer: {
        useQuery: vi.fn(() => ({ data: undefined, isLoading: true, isError: false })),
      },
      getBooks: {
        useQuery: vi.fn(() => ({ data: [], isLoading: false, isError: false })),
      },
      getChapter: {
        useQuery: vi.fn(() => ({ data: undefined, isLoading: true, isError: false })),
      },
    },
    diary: {
      list: {
        useQuery: vi.fn(() => ({ data: [], isLoading: false, isError: false })),
      },
      create: {
        useMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
      },
      update: {
        useMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
      },
      delete: {
        useMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
      },
    },
    annotations: {
      getForChapter: {
        useQuery: vi.fn(() => ({ data: [], isLoading: false })),
      },
      listAll: {
        useQuery: vi.fn(() => ({ data: [], isLoading: false })),
      },
      upsert: {
        useMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
      },
      delete: {
        useMutation: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
      },
    },
    useUtils: vi.fn(() => ({
      diary: { list: { invalidate: vi.fn() } },
      annotations: {
        getForChapter: { invalidate: vi.fn() },
        listAll: { invalidate: vi.fn() },
      },
    })),
  },
  trpcClient: {},
}))

describe('App', () => {
  beforeEach(() => {
    // Start at /today so BottomNav is visible (not hidden by splash/auth paths)
    window.history.pushState({}, '', '/today')
    // Mark splash as already played so SplashGate skips the splash screen
    sessionStorage.setItem('splashPlayed', 'true')
  })

  it('renders the bottom navigation', () => {
    render(<App />)
    expect(screen.getByRole('navigation', { name: /bottom navigation/i })).toBeInTheDocument()
  })

  it('renders the Today nav link', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /today/i })).toBeInTheDocument()
  })

  it('renders the Bible nav link', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /bible/i })).toBeInTheDocument()
  })

  it('renders the AI trigger button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /open ai assistant/i })).toBeInTheDocument()
  })

  it('renders the Today page by default', () => {
    render(<App />)
    expect(screen.getByText(/day streak/i)).toBeInTheDocument()
  })
})
