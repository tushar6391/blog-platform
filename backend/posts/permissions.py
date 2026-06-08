from rest_framework import permissions


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Anyone can read. Only the author can modify or delete.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions for everyone (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for the author
        return obj.author == request.user