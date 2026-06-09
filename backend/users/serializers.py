from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['id']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'bio', 'location', 'avatar_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'username', 'email', 'created_at', 'updated_at']