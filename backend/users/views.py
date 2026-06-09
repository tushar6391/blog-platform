from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .models import Profile
from .serializers import RegisterSerializer, ProfileSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Anyone can view profiles. Only the profile owner can edit."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


class ProfileDetailView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/profiles/<id>/ — only owner can edit"""
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]


class MyProfileView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/profiles/me/ — current user's own profile"""
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile