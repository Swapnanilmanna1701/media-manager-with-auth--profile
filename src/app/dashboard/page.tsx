"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Edit, Trash2, Film, Tv, Star, Loader2, Clock, DollarSign, ImageIcon } from "lucide-react";
import { toast } from "sonner";

type Entry = {
  id: number;
  title: string;
  type: "movie" | "tv_show";
  genre: string;
  releaseYear: number;
  rating: number;
  description: string;
  imageUrl: string | null;
  director: string;
  budget: number | null;
  duration: number;
  location: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type FormData = {
  title: string;
  type: "movie" | "tv_show";
  genre: string;
  releaseYear: number;
  rating: number;
  description: string;
  imageUrl: string;
  director: string;
  budget: number | null;
  duration: number;
  location: string;
};

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "movie",
    genre: "",
    releaseYear: new Date().getFullYear(),
    rating: 5,
    description: "",
    imageUrl: "",
    director: "",
    budget: null,
    duration: 120,
    location: "",
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const fetchEntries = useCallback(async (pageNum: number) => {
    if (isLoading || !session?.user) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/entries?page=${pageNum}&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data.length < 20) {
          setHasMore(false);
        }
        setEntries((prev) => pageNum === 1 ? data.data : [...prev, ...data.data]);
      }
    } catch (error) {
      toast.error("Failed to fetch entries");
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [isLoading, session]);

  useEffect(() => {
    if (session?.user) {
      fetchEntries(1);
    }
  }, [session]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (page > 1) {
      fetchEntries(page);
    }
  }, [page]);

  const handleAddEntry = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget || undefined,
          location: formData.location || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Entry added successfully!");
        setIsAddDialogOpen(false);
        resetForm();
        setPage(1);
        setHasMore(true);
        fetchEntries(1);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add entry");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEntry = async () => {
    if (!selectedEntry) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/entries/${selectedEntry.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget || undefined,
          location: formData.location || undefined,
        }),
      });

      if (response.ok) {
        toast.success("Entry updated successfully!");
        setIsEditDialogOpen(false);
        setSelectedEntry(null);
        resetForm();
        setPage(1);
        setHasMore(true);
        fetchEntries(1);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update entry");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/entries/${selectedEntry.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Entry deleted successfully!");
        setIsDeleteDialogOpen(false);
        setSelectedEntry(null);
        setPage(1);
        setHasMore(true);
        fetchEntries(1);
      } else {
        toast.error("Failed to delete entry");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (entry: Entry) => {
    setSelectedEntry(entry);
    setFormData({
      title: entry.title,
      type: entry.type,
      genre: entry.genre,
      releaseYear: entry.releaseYear,
      rating: entry.rating,
      description: entry.description,
      imageUrl: entry.imageUrl || "",
      director: entry.director,
      budget: entry.budget,
      duration: entry.duration,
      location: entry.location || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "movie",
      genre: "",
      releaseYear: new Date().getFullYear(),
      rating: 5,
      description: "",
      imageUrl: "",
      director: "",
      budget: null,
      duration: 120,
      location: "",
    });
  };

  if (isPending || isInitialLoading) {
    return (
      <div className="min-h-screen light-gradient flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen light-gradient">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">My Collection</h1>
            <p className="text-gray-600">Manage your favorite movies and TV shows</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-animated"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Entry
          </Button>
        </div>

        {entries.length === 0 && !isLoading ? (
          <Card className="bg-white border-gray-200 p-12 text-center">
            <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold gradient-text mb-2">No entries yet</h2>
            <p className="text-gray-600 mb-6">Start building your collection by adding your first movie or TV show</p>
            <Button
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-animated"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Entry
            </Button>
          </Card>
        ) : (
          <Card className="bg-white border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-700 font-bold w-20">Poster</TableHead>
                    <TableHead className="text-gray-700 font-bold">Title</TableHead>
                    <TableHead className="text-gray-700 font-bold">Type</TableHead>
                    <TableHead className="text-gray-700 font-bold">Director</TableHead>
                    <TableHead className="text-gray-700 font-bold">Genre</TableHead>
                    <TableHead className="text-gray-700 font-bold">Budget</TableHead>
                    <TableHead className="text-gray-700 font-bold">Duration</TableHead>
                    <TableHead className="text-gray-700 font-bold">Rating</TableHead>
                    <TableHead className="text-gray-700 font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell>
                        {entry.imageUrl ? (
                          <img
                            src={entry.imageUrl}
                            alt={entry.title}
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-bold gradient-text">{entry.title}</TableCell>
                      <TableCell>
                        <Badge variant={entry.type === "movie" ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
                          {entry.type === "movie" ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                          {entry.type === "movie" ? "Movie" : "TV Show"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">{entry.director}</TableCell>
                      <TableCell className="text-gray-700">{entry.genre}</TableCell>
                      <TableCell className="text-gray-700">
                        {entry.budget ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {(entry.budget / 1000000).toFixed(1)}M
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {entry.duration}m
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          <span className="text-gray-900 font-semibold">{entry.rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditDialog(entry)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 btn-animated"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDeleteDialog(entry)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 btn-animated"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {isLoading && (
              <div className="py-8 text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              </div>
            )}
            
            <div ref={observerTarget} className="h-4" />
          </Card>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Add New Entry</DialogTitle>
            <DialogDescription className="text-gray-600">
              Add a new movie or TV show to your collection
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-title" className="font-bold text-gray-900">Title *</Label>
              <Input
                id="add-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-type" className="font-bold text-gray-900">Type *</Label>
                <Select value={formData.type} onValueChange={(value: "movie" | "tv_show") => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50 border-gray-300">
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="tv_show">TV Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-director" className="font-bold text-gray-900">Director *</Label>
                <Input
                  id="add-director"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., Christopher Nolan"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-genre" className="font-bold text-gray-900">Genre *</Label>
                <Input
                  id="add-genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., Drama, Action, Comedy"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-year" className="font-bold text-gray-900">Release Year *</Label>
                <Input
                  id="add-year"
                  type="number"
                  value={formData.releaseYear}
                  onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-budget" className="font-bold text-gray-900">Budget ($)</Label>
                <Input
                  id="add-budget"
                  type="number"
                  value={formData.budget || ""}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value ? parseFloat(e.target.value) : null })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., 15000000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-duration" className="font-bold text-gray-900">Duration (minutes) *</Label>
                <Input
                  id="add-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., 142"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="add-rating" className="font-bold text-gray-900">Rating (0-10) *</Label>
                <Input
                  id="add-rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., 8.5"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-location" className="font-bold text-gray-900">Location</Label>
                <Input
                  id="add-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., Hollywood, California"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-image" className="font-bold text-gray-900">Poster URL</Label>
              <Input
                id="add-image"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="bg-white border-gray-300 text-gray-900"
                placeholder="https://example.com/poster.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-description" className="font-bold text-gray-900">Description *</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white border-gray-300 text-gray-900 min-h-[100px]"
                placeholder="Enter a brief description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-300 btn-animated">
              Cancel
            </Button>
            <Button onClick={handleAddEntry} disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-animated">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white border-gray-200 text-gray-900 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Edit Entry</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update the details of your entry
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title" className="font-bold text-gray-900">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type" className="font-bold text-gray-900">Type *</Label>
                <Select value={formData.type} onValueChange={(value: "movie" | "tv_show") => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50 border-gray-300">
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="tv_show">TV Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-director" className="font-bold text-gray-900">Director *</Label>
                <Input
                  id="edit-director"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., Christopher Nolan"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-genre" className="font-bold text-gray-900">Genre *</Label>
                <Input
                  id="edit-genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., Drama, Action, Comedy"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-year" className="font-bold text-gray-900">Release Year *</Label>
                <Input
                  id="edit-year"
                  type="number"
                  value={formData.releaseYear}
                  onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-budget" className="font-bold text-gray-900">Budget ($)</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={formData.budget || ""}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value ? parseFloat(e.target.value) : null })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., 15000000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration" className="font-bold text-gray-900">Duration (minutes) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., 142"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-rating" className="font-bold text-gray-900">Rating (0-10) *</Label>
                <Input
                  id="edit-rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., 8.5"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location" className="font-bold text-gray-900">Location</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-white border-gray-300 text-gray-900"
                  placeholder="e.g., Hollywood, California"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-image" className="font-bold text-gray-900">Poster URL</Label>
              <Input
                id="edit-image"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="bg-white border-gray-300 text-gray-900"
                placeholder="https://example.com/poster.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description" className="font-bold text-gray-900">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white border-gray-300 text-gray-900 min-h-[100px]"
                placeholder="Enter a brief description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gray-300 btn-animated">
              Cancel
            </Button>
            <Button onClick={handleEditEntry} disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white btn-animated">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This action cannot be undone. This will permanently delete "{selectedEntry?.title}" from your collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 btn-animated">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEntry}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white btn-animated"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}