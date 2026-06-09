from django.db import models
from django.contrib.auth.models import User


class Post(models.Model):
    CATEGORY_CHOICES = [
        ('reflective', 'Reflective'),
        ('joyful', 'Joyful'),
        ('dark', 'Dark'),
        ('romantic', 'Romantic'),
        ('adventure', 'Adventure'),
        ('melancholy', 'Melancholy'),
        ('curious', 'Curious'),
        ('bold', 'Bold'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='posts',
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='reflective',
    )
    cover_image_url = models.URLField(
        max_length=500,
        blank=True,
        default='',
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft',
    )
    liked_by = models.ManyToManyField(
        User,
        related_name='liked_posts',
        blank=True,
    )
    bookmarked_by = models.ManyToManyField(
        User,
        related_name='bookmarked_posts',
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.author.username}"