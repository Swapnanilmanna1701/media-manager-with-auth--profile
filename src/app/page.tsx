"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film, Tv, Star, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen netflix-gradient">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Film className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold text-white">MovieFlix</span>
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:text-red-400">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" className="text-white hover:text-red-400">
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-red-400">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 netflix-hero-gradient">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Film className="w-20 h-20 text-red-500 animate-pulse" />
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Your Personal
            <span className="text-red-500"> Movie Collection</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Track, manage, and discover your favorite movies and TV shows all in one place.
            Never forget what to watch next.
          </p>
          <div className="flex justify-center gap-4">
            <Link href={session?.user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-900/30 to-black/50 p-8 rounded-xl border border-red-500/20 hover:border-red-500/50 transition-all">
              <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Film className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Track Movies</h3>
              <p className="text-gray-400">
                Keep track of all your favorite movies with details like genre, rating, and release year.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-black/50 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Tv className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">TV Shows</h3>
              <p className="text-gray-400">
                Manage your TV show collection and never miss an episode of your favorite series.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/30 to-black/50 p-8 rounded-xl border border-yellow-500/20 hover:border-yellow-500/50 transition-all">
              <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Rate & Review</h3>
              <p className="text-gray-400">
                Add your personal ratings and keep notes about what you loved or didn't.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-red-600/20 to-purple-600/20 p-12 rounded-2xl border border-red-500/30 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of movie enthusiasts managing their collections with MovieFlix.
            </p>
            <Link href={session?.user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6">
                {session?.user ? "Go to Dashboard" : "Create Free Account"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 MovieFlix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}