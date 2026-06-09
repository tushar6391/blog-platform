from django.urls import path
from .views import RegisterView, ProfileDetailView, MyProfileView


urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('profiles/me/', MyProfileView.as_view(), name='my-profile'),
    path('profiles/<int:pk>/', ProfileDetailView.as_view(), name='profile-detail'),
]