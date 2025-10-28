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
      <div className="min-h-screen light-gradient flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
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
    <div className="min-h-screen light-gradient">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold gradient-text">Account Details</CardTitle>
              <CardDescription className="text-gray-600">
                Your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-900 font-bold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name
                </Label>
                <Input
                  value={session.user.name || ""}
                  disabled
                  className="bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900 font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  value={session.user.email}
                  disabled
                  className="bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-900 font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <Input
                  value={formatDate(session.user.createdAt)}
                  disabled
                  className="bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg border border-blue-300">
                  <h3 className="font-bold gradient-text mb-2">Account Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Account Status</p>
                      <p className="text-gray-900 font-bold">Active</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Email Verified</p>
                      <p className="text-gray-900 font-bold">
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