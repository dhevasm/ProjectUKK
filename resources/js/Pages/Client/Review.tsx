import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface User {
    name: string;
    image: string;
}

interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: User;
}

interface ReviewProps {
    reviews: Review[];
    isCanReview: boolean;
    productId: number;
}

export default function Review({ reviews, isCanReview, productId }: ReviewProps) {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);

    const averageRating = reviews.length
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const [data, setData] = useState({
        "product_id": productId,
        "comment": ""
    });

    const handleReview = () => {
        if (rating === 0) {
            toast.warning('No rating selected.', {
                description : 'Please select a rating to submit your review.',
            });
            return;
        }

        if (data.comment === "") {
            toast.warning('No comment entered.', {
                description : 'Please enter a comment to submit your review.',
            });
            return;
        }

        router.post(route('review.store'), {
            product_id: data.product_id,
            rating: rating,
            comment: data.comment
        }, {
            preserveScroll: true,
      onSuccess: () => {
            toast.success('Berhasil Menambah Review.', {
                description : 'Your review image has been added successfully.',
            });
        },
        onError: (errors) => {
            toast.error("Failed to adding review", {
                description: "An error occurred : " + Object.values(errors)[0],
            });
        }
        });
    }

    return (
        <div className="w-full bg-background dark:bg-customDark2 py-8">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-foreground dark:text-white mb-2 lg:mb-0">
                        Customer Reviews
                    </h2>

                    {reviews.length > 0 && (
                        <div className="flex items-center space-x-6 p-4 rounded-lg bg-card dark:bg-cusborder-customDark shadow-md">
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-1 bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">
                                    {averageRating}
                                </div>
                                <div className="flex gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "h-4 w-4",
                                                star <= Number(averageRating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "fill-muted text-muted dark:fill-slate-600 dark:text-slate-600"
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="text-xs text-muted-foreground dark:text-slate-400">
                                    from {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                                </div>
                            </div>

                            <div className="hidden lg:block h-12 w-px bg-border dark:bg-customDark2" />

                            <div className="hidden lg:block">
                                {[5, 4, 3, 2, 1].map((num) => {
                                    const count = reviews.filter(r => r.rating === num).length;
                                    const percentage = (count / reviews.length) * 100;
                                    return (
                                        <div key={num} className="flex items-center gap-2 mb-1">
                                            <div className="text-xs text-muted-foreground dark:text-slate-400 w-3">{num}</div>
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            <div className="w-24 h-1.5 bg-muted dark:bg-customDark2 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="text-xs text-muted-foreground dark:text-slate-400 w-8">
                                                {count}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Add Review Form */}
                {isCanReview && (
                    <Card className="mb-8 border border-border dark:border-customDark shadow-md dark:bg-cusborder-customDark/50 backdrop-blur">
                        <CardHeader className="border-b border-border dark:border-cusbg-customDark2 bg-muted/50 dark:bg-cusborder-customDark py-4">
                            <CardTitle className="text-lg">Write Your Review</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="flex flex-col items-center space-y-3">
                                    <div className="text-sm font-medium text-foreground dark:text-white">
                                        Rate this product
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1.5 hover:scale-110 transform transition-all duration-200"
                                            >
                                                <Star
                                                    className={cn(
                                                        "h-6 w-6",
                                                        (hoverRating || rating) >= star
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "fill-muted text-muted dark:fill-slate-600 dark:text-slate-600"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="comment" className="text-sm font-medium text-foreground dark:text-white">
                                        Your Review
                                    </Label>
                                    <Textarea
                                        id="comment"
                                        value={data.comment}
                                        onChange={(e) => setData({ ...data, comment: e.target.value })}
                                        placeholder="Share your experience with this product..."
                                        className="min-h-[120px] text-sm resize-none bg-background dark:bg-cusborder-customDark border focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <Button
                                    onClick={handleReview}
                                    className="w-full py-2 h-9 text-sm"
                                    variant={"theme"}
                                >
                                    Submit Review
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Existing Reviews */}
                <div className="space-y-4">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <Card
                                key={review.id}
                                className="group hover:shadow-lg transition-all duration-300 dark:bg-cusborder-customDark/50 backdrop-blur border border-border dark:border-cusbg-customDark2"
                            >
                                <CardContent className="p-6">

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex flex-col items-center sm:items-start">
                                            <Avatar className="h-12 w-12 ring-2 ring-background dark:ring-cusbg-customDark2 transition-all duration-300">
                                                {review.user.image && review.user.image.includes('storage') ? (
                                                    <AvatarImage src={"/" + review.user.image} className="object-cover" />
                                                ) : (
                                                    <AvatarImage src={review.user.image} className="object-cover" />
                                                )}
                                                <AvatarFallback className="bg-primary/10 dark:bg-customDark2 text-base font-medium">
                                                    {review.user.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <h4 className="mt-2 font-medium text-base text-foreground dark:text-white">
                                                {review.user.name}
                                            </h4>
                                            <span className="text-xs text-muted-foreground dark:text-slate-400">
                                                {new Date(review.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={cn(
                                                            "h-4 w-4",
                                                            i < review.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "fill-muted text-muted dark:fill-slate-600 dark:text-slate-600"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-foreground dark:text-slate-300 text-sm leading-relaxed">
                                                {review.comment}
                                            </p>
                                        </div>
                                        <div className="self-end">
                                        <Trash2 onClick={() => {
                                            router.delete(route('review.destroy', { id: review.id }), {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    toast.success('Review Deleted.', {
                                                        description : 'Your review has been deleted successfully.',
                                                    });
                                                },
                                                onError: (errors) => {
                                                    toast.error("Failed to delete review", {
                                                        description: "An error occurred : " + Object.values(errors)[0],
                                                    });
                                                }
                                            });
                                        }} className="w-5 hover:cursor-pointer hover:text-red-500"/>
                                    </div>
                                    </div>

                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="text-center py-12 dark:bg-cusborder-customDark/50 backdrop-blur border border-dashed border-border dark:border-cusbg-customDark2">
                            <Star className="h-12 w-12 mx-auto mb-4 text-muted dark:text-slate-600" />
                            <h3 className="text-xl font-semibold text-foreground dark:text-white mb-1">No Reviews Yet</h3>
                            <p className="text-sm text-muted-foreground dark:text-slate-400">
                                Be the first to share your experience!
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
