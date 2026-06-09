from django.urls import path
from .views import (
    PostListCreateView,
    PostDetailView,
    PostLikeToggleView,
    PostBookmarkToggleView,
    MyBookmarksView,
)


urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', PostLikeToggleView.as_view(), name='post-like-toggle'),
    path('posts/<int:pk>/bookmark/', PostBookmarkToggleView.as_view(), name='post-bookmark-toggle'),
    path('bookmarks/', MyBookmarksView.as_view(), name='my-bookmarks'),
]