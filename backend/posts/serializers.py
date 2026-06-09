from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    bookmark_count = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'author',
            'category', 'cover_image_url', 'status',
            'like_count', 'is_liked',
            'bookmark_count', 'is_bookmarked',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'author',
            'like_count', 'is_liked',
            'bookmark_count', 'is_bookmarked',
            'created_at', 'updated_at',
        ]

    def get_like_count(self, obj):
        return obj.liked_by.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.liked_by.filter(id=request.user.id).exists()
        return False

    def get_bookmark_count(self, obj):
        return obj.bookmarked_by.count()

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarked_by.filter(id=request.user.id).exists()
        return False