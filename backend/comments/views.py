from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from posts.models import Post
from .models import Comment
from .serializers import CommentSerializer
from .permissions import IsAuthorOrReadOnly


class CommentListCreateView(generics.ListCreateAPIView):
    """GET /api/posts/<post_id>/comments/ — list comments on a post
       POST /api/posts/<post_id>/comments/ — create a comment (auth required)"""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post = get_object_or_404(Post, pk=self.kwargs['post_id'])
        serializer.save(author=self.request.user, post=post)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/comments/<id>/ — author-only modify"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthorOrReadOnly]