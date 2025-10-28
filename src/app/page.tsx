"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film, Tv, Star, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen light-gradient">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Film className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold gradient-text">MovieFlix</span>
          </Link>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-animated">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 light-hero-gradient">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Film className="w-20 h-20 text-blue-600 animate-pulse" />
              <Sparkles className="w-8 h-8 text-purple-500 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl mb-6">
            <span className="font-normal text-gray-700">Your Personal</span>
            <br />
            <span className="font-bold gradient-text">Movie Collection</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track, manage, and discover your favorite movies and TV shows all in one place.
            Never forget what to watch next.
          </p>
          <div className="flex justify-center gap-4">
            <Link href={session?.user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 btn-animated">
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-gray-700 border-gray-300 hover:bg-gray-100 text-lg px-8 py-6 btn-animated">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center gradient-text mb-16">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Film className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-4">Track Movies</h3>
              <p className="text-gray-600">
                Keep track of all your favorite movies with details like genre, rating, and release year.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Tv className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-4">TV Shows</h3>
              <p className="text-gray-600">
                Manage your TV show collection and never miss an episode of your favorite series.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-white p-8 rounded-xl border border-indigo-200 hover:border-indigo-400 transition-all hover:shadow-lg">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-4">Rate & Review</h3>
              <p className="text-gray-600">
                Add your personal ratings and keep notes about what you loved or didn't.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-12 rounded-2xl border border-blue-300 text-center">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Ready to Start?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of movie enthusiasts managing their collections with MovieFlix.
            </p>
            <Link href={session?.user ? "/dashboard" : "/signup"}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 btn-animated">
                {session?.user ? "Go to Dashboard" : "Create Free Account"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; 2024 MovieFlix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}