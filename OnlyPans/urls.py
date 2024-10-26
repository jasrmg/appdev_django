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
  path('edit_post/<int:post_id>/', views.edit_post, name='edit_post'),

  path('edit_profile/<str:username>/', views.edit_profile, name='edit_profile'),
  path('create_post/<str:username>/', views.create_post, name='create_post'),

  
  path('edit_bio/<str:username>/', views.edit_bio, name='edit_bio'),
  

  #follow unfollow
  path('follow/<str:username>/', views.follow_user, name='follow_user'),
  #like unlike
  path('like/<int:post_id>/', views.like_view, name='like'),

  #comment
  path('add_comment/', views.add_comment, name='add_comment'),
  path('delete_comment/<int:comment_id>/', views.delete_comment, name='delete_comment'),
  #search test
  path('search/', views.search_view, name='search'),
  #search template
  path('search_template/', views.search_test),
]