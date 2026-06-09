from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Post
from .serializers import PostSerializer
from .permissions import IsAuthorOrReadOnly


class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Filtering, searching, ordering
    filterset_fields = ['author', 'category', 'status']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """By default, only show published posts.
        Authors see their own drafts via status=draft filter."""
        qs = Post.objects.all()
        status_filter = self.request.query_params.get('status')
        
        if status_filter == 'draft':
            # Only authenticated users can see drafts, and only their own
            if self.request.user.is_authenticated:
                return qs.filter(status='draft', author=self.request.user)
            return qs.none()
        
        # Default: only published posts
        return qs.filter(status='published')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly]


class PostLikeToggleView(APIView):
    """POST /api/posts/<pk>/like/ — toggle like on a post"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        user = request.user

        if post.liked_by.filter(id=user.id).exists():
            post.liked_by.remove(user)
            liked = False
        else:
            post.liked_by.add(user)
            liked = True

        return Response({
            'liked': liked,
            'like_count': post.liked_by.count(),
        }, status=status.HTTP_200_OK)


class PostBookmarkToggleView(APIView):
    """POST /api/posts/<pk>/bookmark/ — toggle bookmark"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        user = request.user

        if post.bookmarked_by.filter(id=user.id).exists():
            post.bookmarked_by.remove(user)
            bookmarked = False
        else:
            post.bookmarked_by.add(user)
            bookmarked = True

        return Response({
            'bookmarked': bookmarked,
            'bookmark_count': post.bookmarked_by.count(),
        }, status=status.HTTP_200_OK)


class MyBookmarksView(generics.ListAPIView):
    """GET /api/bookmarks/ — current user's bookmarked posts"""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.bookmarked_posts.filter(status='published')