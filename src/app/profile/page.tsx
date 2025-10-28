"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, User, Mail, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen netflix-gradient flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen netflix-gradient">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
            <p className="text-gray-400">Manage your account information</p>
          </div>

          <Card className="bg-black/60 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Account Details</CardTitle>
              <CardDescription className="text-gray-400">
                Your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name
                </Label>
                <Input
                  value={session.user.name || ""}
                  disabled
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  value={session.user.email}
                  disabled
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <Input
                  value={formatDate(session.user.createdAt)}
                  disabled
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="bg-gradient-to-r from-red-600/20 to-purple-600/20 p-6 rounded-lg border border-red-500/30">
                  <h3 className="text-white font-semibold mb-2">Account Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-gray-400 text-sm">Account Status</p>
                      <p className="text-white font-medium">Active</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email Verified</p>
                      <p className="text-white font-medium">
                        {session.user.emailVerified ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
