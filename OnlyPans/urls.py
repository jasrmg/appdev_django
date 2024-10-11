from django.urls import path
from . import views

urlpatterns = [
  path('', views.test),
  path('signin/', views.login_view, name='login'),#login
  path('signup/', views.signup_view, name='signup'),#register
  path('logout/', views.logout_view, name='logout'),
  

  #logged in user:
  path('profile/<str:username>/', views.profile_view, name='profile'),
  path('home/', views.home, name='home'),
  
  #delete post:
  path('delete_post/<int:post_id>/', views.delete_post, name='delete_post'),
  #edit post:
  # path('edit_post/<int:post_id>/', views.edit_post, name='edit_post'),

  #MODALS
  path('edit_profile/<str:username>/', views.edit_profile, name='edit_profile'),
  path('create_post/<str:username>/', views.create_post, name='create_post'),

  #search test
  path('search/', views.search_view, name='search'),
]